#include "image_processing.h"
#include <iostream>
#include <CCfits>
#include <valarray>
#include <vector>
#include <unordered_map>

using namespace std;

class ImageProcessing::logger {
public:
    logger(bool enabled) : enabled{enabled} {
        if(enabled) {
            cerr << "[DEBUG][ImageProcessing-c++] ";
        }
    }

    template<typename T> logger &operator<<(const T &t) {
        if(enabled)
            cerr << t;
        return *this;
    }

    ~logger() {
        if(enabled) {
            cerr << endl;
        }
    }

private:
    bool enabled;
};

#define LOG() logger(this->debug_log)


int getBPP(const cv::Mat &image) {
    switch(image.depth()) {
        case CV_8U:
        case CV_8S:
            return 8;
        case CV_16U:
        case CV_16S:
            return 16;
        default:
            return 32; // This really shouldn't be happening though..
    }
}


ImageProcessing::ImageProcessing(const string &fitsfile, bool debug_log) : debug_log{debug_log} {
    LOG() << "Opening fits file: " << fitsfile;
    auto fits = make_unique<CCfits::FITS>(fitsfile, CCfits::Read, true);
    LOG() << "File opened, reading HDU";

    CCfits::PHDU& fits_image = fits->pHDU(); 
    
    valarray<uint16_t>  contents;

#ifdef DEBUG_HDU 
    LOG() << "HDUs: ";
    for(auto ext: fits->extension()) {
        LOG() << ext.first << ", " << ext.second->name();
    }
    fits_image.readAllKeys();
    for(auto kk: fits_image.keyWord()) {
        LOG() << "read keyword: " << kk.first;
    }
 
    LOG() << "bitpix: " << fits_image.bitpix() << ", axes: " << fits_image.axes();
#endif

    try {
        fits_image.readKey("BAYERPAT", this->bayerPattern);
        LOG() << "Found bayer pattern: " << this->bayerPattern;
    } catch(const CCfits::HDU::NoSuchKeyword &) {
        LOG()  << "no bayer pattern detected, processing as B/W image";
    }
    try {
        fits_image.read(contents);
        LOG() << "read " << contents.size() << " values";
        image_data = vector<uint16_t>(contents.size());
        move(begin(contents), end(contents), image_data.begin());
        LOG() << "moved " << image_data.size() << " values";
        // TODO: datatype check
        this->image = cv::Mat(fits_image.axis(1), fits_image.axis(0), fits_image.bitpix() == 16 ? CV_16UC1 : CV_8UC1, image_data.data());
        LOG() << "created cv::Mat";
    }  catch(const CCfits::FitsException &e) {
        std::cerr << "Error while reading FITS image: " << e.message() << std::endl;
        throw e;
    }
}

ImageProcessing::~ImageProcessing() {
}

void ImageProcessing::debayer(std::string pattern) {
    if(pattern.empty() || pattern == "auto") {
        pattern = this->bayerPattern;
    }
    static const std::unordered_map<std::string, int> patterns = {
        {"RGGB", cv::COLOR_BayerRG2RGB},
        {"GRBG", cv::COLOR_BayerGR2RGB},
        {"GBRG", cv::COLOR_BayerGB2RGB},
        {"BGGR", cv::COLOR_BayerBG2RGB},
    };
    try {
        cv::cvtColor(this->image, this->image, patterns.at(pattern));
    } catch(const std::out_of_range &) {
    }
}

void ImageProcessing::save(const std::string &filename) {
    cv::imwrite(filename, this->image);
}

cv::Mat ImageProcessing::to8Bit(const cv::Mat &source) {
    int source_bpp = getBPP(source);
    LOG() << "Converting image to 8bit from " << source_bpp;
    if(source_bpp == 8) {
        return source;
    }
    cv::Mat dest;
    source.convertTo(dest, CV_8UC1, 0.00390625);
    return dest;
}


void ImageProcessing::autostretch() {
    LOG() << "autostretch";
    cv::Mat normedImage;
    cv::normalize(this->image, normedImage, 0, (1 << this->bpp()), cv::NORM_MINMAX);
    cv::equalizeHist(to8Bit(normedImage), this->image);
}

#include <iostream>

void ImageProcessing::clip(float min, float max) {
    int maxBPPValue = (1 << this->bpp());


    LOG() << "ImageProcessing::clip(" << min << ", " << max << ")";
    const int thresholdMin = static_cast<int>(min * maxBPPValue);
    const int thresholdMax = static_cast<int>(max * maxBPPValue);
    LOG()  << "maxBPPValue=" << maxBPPValue << ", thresholdMin=" << thresholdMin << ", thresholdMax=" << thresholdMax;
    if(min > 0) {
        this->image -= thresholdMin;
    }
    if(max < 1) {
        cv::Mat source;
        this->image.convertTo(source, CV_32FC1);
        cv::threshold(source, this->image, thresholdMax, 0, cv::THRESH_TRUNC);
    }

    double minVal, maxVal;
    cv::minMaxLoc(image, &minVal, &maxVal);
    auto clipped = (image - minVal) * ( (maxBPPValue - 1)/ (maxVal - minVal));
    this->image = to8Bit(clipped);
}


void ImageProcessing::resize(int width, int height, const string &interpolation) {
    LOG() << "resize: " << width << "x" << height << ", " << interpolation;
    int interpolation_mode = cv::INTER_LINEAR;
    if(interpolation == "NEAREST") {
        interpolation_mode = cv::INTER_NEAREST;
    }
    else if(interpolation == "CUBIC") {
        interpolation_mode = cv::INTER_CUBIC;
    }
    else if(interpolation == "LANCZOS4") {
        interpolation_mode = cv::INTER_LANCZOS4;
    }
    cv::resize(this->image, this->image, cv::Size{width, height}, 0, 0, interpolation_mode);
}

int ImageProcessing::width() const {
    return this->image.cols;
}

int ImageProcessing::height() const {
    return this->image.rows;
}

int ImageProcessing::bpp() const {
    return getBPP(this->image);
}

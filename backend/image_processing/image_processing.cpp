#include "image_processing.h"
#include <iostream>
#include <CCfits>
#include <valarray>
#include <vector>

using namespace std;


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

ImageProcessing::ImageProcessing(const string &fitsfile) {
    auto fits = make_unique<CCfits::FITS>(fitsfile, CCfits::Read, true);

    CCfits::PHDU& fits_image = fits->pHDU(); 
    
    valarray<uint16_t>  contents;

//    cerr << "HDUs: " << endl;
//    for(auto ext: fits->extension()) {
//        cerr << ext.first << ", " << ext.second->name() << endl;
//    }
//    fits_image.readAllKeys();
//    for(auto kk: fits_image.keyWord()) {
//        cerr << "read keyword: " << kk.first << endl;
//    }
//
//    cerr << "bitpix: " << fits_image.bitpix() << ", axes: " << fits_image.axes() << endl;

    fits_image.read(contents);
    static vector<uint16_t> data(contents.size());
    move(begin(contents), end(contents), data.begin());
    // TODO: datatype check
    this->image = cv::Mat(fits_image.axis(1), fits_image.axis(0), fits_image.bitpix() == 16 ? CV_16UC1 : CV_8UC1, data.data());
}

ImageProcessing::~ImageProcessing() {
}

void ImageProcessing::save(const std::string &filename) {
    cv::imwrite(filename, this->image);
}

cv::Mat to8Bit(const cv::Mat &source) {
    int source_bpp = getBPP(source);
    cerr << "Converting image to 8bit from " << source_bpp << endl;
    if(source_bpp == 8) {
        return source;
    }
    cv::Mat dest;
    source.convertTo(dest, CV_8UC1, 0.00390625);
    return dest;
}


void ImageProcessing::autostretch() {
    cv::Mat normedImage;
    cv::normalize(this->image, normedImage, 0, (1 << this->bpp()), cv::NORM_MINMAX);
    cv::equalizeHist(to8Bit(normedImage), this->image);
}

#include <iostream>

void ImageProcessing::clip(float min, float max) {
    int maxBPPValue = (1 << this->bpp());


    cerr << "ImageProcessing::clip(" << min << ", " << max << ")\n";
    const int thresholdMin = static_cast<int>(min * maxBPPValue);
    const int thresholdMax = static_cast<int>(max * maxBPPValue);
    cerr << "maxBPPValue=" << maxBPPValue << ", thresholdMin=" << thresholdMin << ", thresholdMax=" << thresholdMax << endl;
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

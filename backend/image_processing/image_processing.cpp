#include "image_processing.h"
#include <iostream>
#include <CCfits>
#include <valarray>
#include <vector>

using namespace std;

ImageProcessing::ImageProcessing(const string &fitsfile) {
    auto fits = make_unique<CCfits::FITS>(fitsfile, CCfits::Read, true);

    CCfits::PHDU& fits_image = fits->pHDU(); 
    
    valarray<uint16_t>  contents;
    fits_image.read(contents);
    static vector<uint16_t> data(contents.size());
    move(begin(contents), end(contents), data.begin());
    // TODO: datatype check
    cv::Mat(fits_image.axis(1), fits_image.axis(0), CV_16UC1, data.data()).convertTo(this->image, CV_8UC1, 0.00390625);
}

ImageProcessing::~ImageProcessing() {
}

void ImageProcessing::save(const std::string &filename) {
    cv::imwrite(filename, this->image);
}

void ImageProcessing::autostretch() {
    auto image = this->image;
    cv::equalizeHist(image, this->image);
}


void ImageProcessing::clip(int min, int max) {
    if(min > 0) {
        this->image -= min;
    }
    if(max < 255) {
        cv::threshold(this->image, this->image, max, 0, cv::THRESH_TRUNC);
    }

    double minVal, maxVal;
    cv::minMaxLoc(image, &minVal, &maxVal);
    image = (image - minVal) * (255 / (maxVal - minVal));
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

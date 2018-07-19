#include "image_processing_p.h"

#include <CCfits>
#include <valarray>
#include <vector>

#include <iostream>
using namespace std;

ImageProcessing::Private::Private() {
}

void ImageProcessing::Private::open(const string &filename) {
    auto fits = make_unique<CCfits::FITS>(filename, CCfits::Read, true);

    CCfits::PHDU& image = fits->pHDU(); 
    
    valarray<uint16_t>  contents;
    image.read(contents);
    static vector<uint16_t> data(contents.size());
    move(begin(contents), end(contents), data.begin());
    // TODO: datatype check
    cv::Mat(image.axis(1), image.axis(0), CV_16UC1, data.data()).convertTo(this->image, CV_8UC1, 0.00390625);
}



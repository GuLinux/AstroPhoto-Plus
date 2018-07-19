#include "image_processing.h"
#include "image_processing_p.h"
#include <iostream>

using namespace std;

ImageProcessing::ImageProcessing(const string &fitsfile) : d{make_unique<Private>()} {
    cerr << "Using FITS file: " << fitsfile << endl;
    d->open(fitsfile);
}

ImageProcessing::~ImageProcessing() {
    cerr << "~ImageProcessing" << endl;
}

void ImageProcessing::save(const std::string &filename) {
    cv::imwrite(filename, d->image);
}

void ImageProcessing::autostretch() {
    auto image = d->image;
    cv::equalizeHist(image, d->image);
}

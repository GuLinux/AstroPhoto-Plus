#ifndef IMAGE_PROCESSING_P_H
#define IMAGE_PROCESSING_P_H

#include "image_processing.h"
#include <opencv2/opencv.hpp>

class ImageProcessing::Private {
public:
    Private();
    void open(const std::string &filename);
    cv::Mat image;
};

#endif

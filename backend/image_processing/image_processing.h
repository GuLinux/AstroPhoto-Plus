#ifndef IMAGE_PROCESSING_H
#define IMAGE_PROCESSING_H

#include <string>
#include <memory>
#include <opencv2/opencv.hpp>

#include "image_processing.h"

class ImageProcessing {
public:
    ImageProcessing(const std::string &fitsfile);
    ~ImageProcessing();
    void save(const std::string &filename);
    void autostretch();
    void clip(float min, float max);
    void resize(int width, int height, const std::string &interpolation);
    int width() const;
    int height() const;
    int bpp() const;
private:
    cv::Mat image;
};

#endif


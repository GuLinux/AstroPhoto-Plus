#ifndef IMAGE_PROCESSING_H
#define IMAGE_PROCESSING_H

#include <string>
#include <memory>
#include <vector>
#include <opencv2/opencv.hpp>

#include "image_processing.h"

class ImageProcessing {
public:
    ImageProcessing(const std::string &fitsfile, bool debug_log);
    ~ImageProcessing();
    void save(const std::string &filename);
    void autostretch();
    void clip(float min, float max);
    void resize(int width, int height, const std::string &interpolation);
    int width() const;
    int height() const;
    int bpp() const;
    void debayer(std::string pattern);
    cv::Mat to8Bit(const cv::Mat &source);
    class logger;
private:
    std::string bayerPattern;
    bool debug_log;
    cv::Mat image;
    std::vector<uint16_t> image_data;
};

#endif


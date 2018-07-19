#ifndef IMAGE_PROCESSING_H
#define IMAGE_PROCESSING_H

#include <string>
#include <memory>

class ImageProcessing {
public:
    ImageProcessing(const std::string &fitsfile);
    ~ImageProcessing();
    void save(const std::string &filename);
    void autostretch();
private:
    class Private;
    std::unique_ptr<Private> d;
};

#endif


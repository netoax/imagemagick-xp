imagemagick = require ('imagemagick-native')
// let gm = require('gm').subClass({appPath: '/usr/bin/'});
fs = require('fs')

/*
    Use case

    Knowledge base:
        resizeStyle
            - fill: forget aspect ratio, get the exact provided size
            - aspectfit:  keep aspect ratio, get maximum image that fits inside provided size

        1. Resize a while gif to test the library???
        2. Resize the requested image with 'aspectfit' style
        3. In case of error, return
        4. In case of success,

        composite function
            - Composite a buffer provided as options.compositeData on a buffer provided as options.srcData with gravity specified by options.gravity and return a Buffer.
*/

const BACKGROUND_IMAGE_PATH = './images/white.gif'
const TMP_FILE_PATH = '/tmp/tmp.jpg'

function convert_image_node10(imagePath, width, height, format, outputPath) {
    // Read `white.gif` image and convert it based on width, style, height and quality
    const imgBuffer = imagemagick.convert({srcData: fs.readFileSync(BACKGROUND_IMAGE_PATH), width, resizeStyle: 'fill', height, quality: 75})

    // Read the image inputed by the user and convert it based on width, style, height and quality
    const outputBuffer = imagemagick.convert({srcData: fs.readFileSync(imagePath), width, resizeStyle: 'aspectfit', height, quality: 75})

    // Compose the user image with the `white.gif` image
    const outCompositeBuffer = imagemagick.composite({srcData: imgBuffer, compositeData: outputBuffer, gravity: 'CenterGravity'})

    // Write output to file
    fs.writeFileSync(outputPath, outCompositeBuffer);
}

function convert_image_node18(imagePath, width, height, format, outputPath) {
    // Resize background image `white.gif` by ignoring espect ratio, same behavior as imagemagick:resizeStyle:fill
    gm(BACKGROUND_IMAGE_PATH)
        .resize(width, height, '!')
        .quality(75)
        .toBuffer(format, (err, imgBuffer) => {
            if (err) {
                console.log(err);
                return
            };

            // Resize the image inputed by the user and write the output to a tempory file
            gm(imagePath)
                .resize(width, height)
                .quality(75)
                .toBuffer(format, (err, outputBuffer) => {
                    if (err) {
                        console.log(err);
                        return
                    }

                    const tmpFile = TMP_FILE_PATH
                    fs.writeFileSync(tmpFile, outputBuffer);

                    // !!! Here is the major difference between the libraries, `composite` method receives only file paths instead of buffers
                    gm(imgBuffer)
                        .gravity('Center')
                        .composite(tmpFile)
                        .write(outputPath, (err) => {
                            if (err) {
                                console.log(err);
                                return
                            }

                            // Release the tmp file created above
                            // We should measure the performance impact of those operations
                            fs.unlinkSync(tmpFile);
                        });
                });
        });
}

const imagePath = './images/image1.webp'
const params = {
    width: 200,
    height: 200,
    format: '.jpg',
}

convert_image_node10(imagePath, params['width'], params['height'], params['format'], './output/image_node10_imagemagick.jpg')
// convert_image_node18(imagePath, params['width'], params['height'], params['format'], './output/image_node18_gm.jpg')
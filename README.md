# imagemagick-xp

This repository aims to validate alternative libs to the [node-imagemagick-native](https://github.com/elad/node-imagemagick-native) library. The main requirement is supporting Node 18+. Also, we want to do the same operations as the original library without friction.

Requirements:
- Support Node 18+
- Support resizing and composite operations without friction

Candidates:

- [gm](https://github.com/aheckmann/gm)


## Installing Native Libraries

- Linux:

    ```bash
    $ sudo apt-get install graphicsmagick libmagick++-dev
    $ sudo ln -s `ls /usr/lib/\`uname -m\`-linux-gnu/ImageMagick-*/bin-q16/Magick++-config | head -n 1` /usr/local/bin/
    ```

## Running

Firstly, install `nvm` to easily switch between Node versions. Then, install Node `v10.20.1` and Node `v18.12.1`.

To run this experiment with `node-imagemagick-native` library and Node `v10.20.1`:

1. `npm i`
2. `node index.js`

To run the experiment with `gm` library and Node `v18.12.1`, please open the `package.json` and rename `gm` to `dependencies` and let the actual dependencies with a placeholder name:

**Before**

```json
...
  "dependencies": {
    "imagemagick-native": "^1.9.3"
  },
  "gm": {
    "gm": "^1.25.0"
  }
...
```

**After**

```json
...
  "imagemagick": {
    "imagemagick-native": "^1.9.3"
  },
  "dependencies": {
    "gm": "^1.25.0"
  }
...
```

Then, you can install the dependency normally with `npm i` and run with `node index.js`.

## Experiment

We are basically testing the following operations:

1. Resizing a background white image (`./images/white.gif`)

2. Resizing one example image (`./images/image1.webp`)

![alt text](./images/image1.webp)

3. Composing the second image with the white background after resizing both:

> It will be visible only with dark mode enabled rsrsrs

![alt text](./output/image_node10_imagemagick.jpg)

!!! info
    You can see the outputs in the `output` folder for both libraries and Node versions. We can achieve the same result.

## Concerns

- In `gm` library, the `composite` operation only supports image path and not buffers. So, my solution was creating a temp file and using it to compose the images.

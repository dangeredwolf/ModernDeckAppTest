# ModernDeck 7 Beta

Welcome to the future of ModernDeck.

ℹ *This README file is in itself a prototype document dealing with all the new build options for ModernDeck, so bear with me if anything is missing.*



Preparation for building ModernDeck from source varies depending on whether you want to build the extension only, or the extension and app.

## Building the ModernDeck (Electron-based) app

ℹ *These steps are not required if you only plan on testing the browser extension and not the app, you can skip to "Building the extension for different browsers" below.*

### Dependencies

To build the ModernDeck app, you need to first install Node.js (which comes with npm), as well as Yarn

ℹ *ModernDeck is tested against the latest LTS version of Node.js, but it will likely work fine with the Current version as well.*

#### Windows

For Windows, [you can download Node.js here](https://nodejs.org/en/)

#### macOS

For macOS, you can install the necessary packages using [Homebrew](https://brew.sh/).

`brew install git node`

❓ *[Alternatively, you can also install nodejs using the .pkg installer](https://nodejs.org/en/)*

#### Linux

On Linux, it varies depending on your distribution. If you're using Ubuntu or Debian, you just need to run:

`sudo apt install git nodejs`

### Checking out

You'll want to use your Terminal (macOS and Linux) or PowerShell (Windows) for this.

⚠ *On Windows, you will need to download git if you haven't yet already. You can either [download just git itself](https://git-scm.com/download/win), or [download GitHub's Windows client](https://desktop.github.com/), which also includes git and other tools, even if you don't use the GUI portion.*

First, of course, `cd` into a directory where you want to clone the source to.

Next, clone the git.

`git clone https://github.com/dangeredwolf/ModernDeckAPPTEST.git`
⚠ *This URL will only be valid until ModernDeck 7.0 is released, where it will be graduated into the main ModernDeck source tree.*

Finally, install all the necessary dependencies

`npm install`
ℹ *This may take several minutes*

### Testing and building

From the main folder where you just were, you can run the app for testing using:

`npm start`

This will allow you to test code changes without creating an installer every time.

If you want to create the proper installers, you can run:

`npm run dist`
...to build for every platform your OS supports building for
`npm run distWindows`
...to build for Windows
`npm run distMac`
...to build for macOS
`npm run distLinux`
...to build for Linux

❓ *For more advanced users, you may prefer to [run electron-builder directly.](https://www.electron.build/)*

⚠ *Building for macOS requires running under macOS. Under macOS, you can build for Windows, macOS, and Linux. Under both Linux and Windows, you can build for both Linux and Windows.*

## Building the extension for different browsers

ℹ *If you have already done the steps above to begin building for apps, you can skip the Checking out section.*

### Checking out

You'll want to use your Terminal (macOS and Linux) or PowerShell (Windows) for this.

⚠ *On Windows, you will need to download git if you haven't yet already. You can either [download just git itself](https://git-scm.com/download/win), or [download GitHub's Windows client](https://desktop.github.com/), which also includes git and other tools, even if you don't use the GUI portion.*

First, of course, `cd` into a directory where you want to clone the source to.

Next, clone the git.

`git clone https://github.com/dangeredwolf/ModernDeckAPPTEST.git`
⚠ *This URL will only be valid until ModernDeck 7.0 is released, where it will be graduated into the main ModernDeck source tree.*

❓ *You can also use [GitHub Desktop](https://desktop.github.com/) to clone ModernDeck*

ℹ *Currently, there is no additional preparation necessary to begin testing ModernDeck in your browser from source.*

### Loading the unpacked extension into your browser

To test the extension, you'll want to load the unpacked extension. This, of course, varies by browser.

#### Chrome

Open the Chrome menu, go to **More tools > Extensions**

Check *Developer Mode* in the corner if you haven't already.

Click the **Load Unpacked** button

Navigate to *ModernDeckAPPTEST\ModernDeck* and click Select Folder

#### Firefox

Go to *about:debugging*
Check **Enable add-on debugging**
Click **Load Temporary Add-on...**
Navigate to *ModernDeckAPPTEST\ModernDeck\manifest.json*

#### Microsoft Edge (EdgeHTML-based)

First, you need to enabled Developer Features, if you haven't already.

Go to *about:flags*
Check *Enable extension developer features*
Restart Edge if it asks you to

Open the **...** menu
Click **Extensions**
Scroll down to the bottom
Click **Load Extension**
Select the folder *ModernDeckAPPTEST\ModernDeck*

#### Microsoft Edge (Chromium-based)

Open the **...** menu
Click **Extension**
Turn on **Developer Mode** in the bottom left if you haven't already

#### Opera

Press *Ctrl+Alt+E* to open Extensions
Check **Developer Mode** if you haven't already
Click **Load Unpacked**
Select *ModernDeckAPPTEST\ModernDeck*


## ❓ Questions?

Don't hesitate to ask!
twitter.com/dangeredwolf or twitter.com/ModernDeck

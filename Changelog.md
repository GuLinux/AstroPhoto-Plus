# Changelog

## [1.0.1] - 16/03/2019
### Minor fixes and enhancements

### Improvements

 - Download FITS files from Camera page
 - Allow to set server name (shown in Menu, Homepage and title bar)
 - Sort INDI devices, groups and properties alphabetically in order to have a more consistent UI
 
### Bugfixes

 - Fix crash when pressing Enter in INDI Profile dialogue
 - Fix debayer issue
 - Fix 8 bit images not properly previewed

## [1.0.0] - 17/02/2019
### First major release - Also renaming to Astro Photo Plus

### New features:

 - Plate solving, featuring a sky map highlighting solution when found.
 - Allow to edit sequence after creation (name, camera, filter wheel, directory).
 - allow to stop and resume sequences.
 - import/export sequences to JSON files.
 - Add "Pause" sequence job, to suspend sequences (for manual refocusing, for instance).
 - INDI autoconnect: connect automatically to INDI Server at startup, or when starting INDI service, and also automatically connect to devices.
 - Correctly handle colour images in Camera page (debayer).
 - Timelapse and groups mode: pause between shots or groups of shots in a sequence.

### Improvements

 - Add '(copy)' suffix to duplicated sequences
 - add "Exposures" card with info about total, finished and remaining shots of a sequence (number and time)
 - allow to "reset" sequences to restart them, or even single sequence jobs.
 - switch to INDI blob for sequences (speed/reliability improvement)
 - Images database optimization
 - Histogram improvements
 - Add "Wait for value" checkbox to INDI property job. This way when changing a property that takes time to get to the desired value (for instance: CCD temperature) it will wait for the value to settle before going forward.
 - Add min/max validation for exposure sequence item depending on camera values
 - Better name for sequence files if no filter wheel is available
 - Autodetect stale sequences
 - Support binning in Camera page
 - Add Histogram in sequence images
 - Lots of minor User Experience improvements

### Bugfixes:

 - Block filter wheel sequence item creation if no filter wheel is defined on sequence
 - Fix histogram not reloading on image changing
 - improve values editing for numbers
 - Fix rare backend crash when camera image changes size

### Notes
 - Make sure you use the new config file for nginx, to allow for big file uploads (necessary for Plate Solving)

## [0.1.1] - 2018-08-03
### User experience improvements
Various UI fixes, particularly for mobile devices.
Also added the capability of running shell commands, configured by `$HOME/.config/AstroPhotoPlus/commands.json`.

This is at the moment very useful for the Raspberry Pi image, to allow reboot, automatic updates and wifi configuration via the Settings page.
Sample configuration: https://github.com/GuLinux/AstroPhotoPlus/blob/master/config/raspberry_pi/commands.json

Added an AUR package for Arch Linux

## [0.1.0] - 2018-07-29
### First public beta
The following features are currently implemented:
 - INDI server management. Start, stop, connect to INDI, select drivers to load, and save profiles for future usage.
 - Sequences: exposures, filter wheel, change camera properties, and run shell command can be added to a sequence. Sequences can be copied to act as "template".
 - Camera: allow to get a preview of the field of view, exposure settings, histogram, and ROI selection for focusing.
 - Image browsing: you can view images shot by a sequence, preview them in your browser, or download the original FITS file.
 - Raspberry pi image available



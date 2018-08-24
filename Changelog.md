# Changelog

## [0.1.2] - Unreleased

 - Allow to edit sequence after creation (name, camera, filter wheel, directory)
 - Add '(copy)' suffix to duplicated sequences
 - Block filter wheel sequence item creation if no filter wheel is defined on sequence
 - add "Exposures" card with info about total, finished and remaining shots of a sequence (number and time)
 - allow to stop and resume sequences.
 - allow to "reset" sequences to restart them.
 - switch to INDI blob for sequences (speed/reliability improvement)
 - import/export sequences to JSON files
 - Images database optimization

## [0.1.1] - 2018-08-03
### User experience improvements
Various UI fixes, particularly for mobile devices.
Also added the capability of running shell commands, configured by `$HOME/.config/StarQuew/commands.json`.

This is at the moment very useful for the Raspberry Pi image, to allow reboot, automatic updates and wifi configuration via the Settings page.
Sample configuration: https://github.com/GuLinux/StarQuew/blob/master/config/raspberry_pi/commands.json

Added an AUR package for Arch Linux

## [0.1.0] - 2018-07-29
### First public beta
The following features are currently implemented:
 - INDI server management. Start, stop, connect to INDI, select drivers to load, and save profiles for future usage.
 - Sequences: exposures, filter wheel, change camera properties, and run shell command can be added to a sequence. Sequences can be copied to act as "template".
 - Camera: allow to get a preview of the field of view, exposure settings, histogram, and ROI selection for focusing.
 - Image browsing: you can view images shot by a sequence, preview them in your browser, or download the original FITS file.
 - Raspberry pi image available



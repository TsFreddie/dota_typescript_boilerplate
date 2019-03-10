# Dota Addon Boilerplate
A boilerplate for dota 2 addon. Using Pug/Sass/Typescript for Panorama and Typescript for VM.

## Structure
* __panorama__ - Contains all your panorama resources
  * __images__ - Panorama images. These will be installed as content.
  * __other__ - [not included] Panorama raw resources. (e.g. webm files). These will be installed to the game folder.
  * __layout__ - Supports pug template and raw xml.
  * __styles__ - Supports scss and raw css.
  * __scripts__ - Panorama codes. Typescripts
* __resource__ - Dota Resources (e.g. Localization files)
* __scripts__ - VM codes & data (all txt files under this will be installed too).
  * __npc__ - Dota NPC data.
  * __vscripts__ - VM codes. Typescripts
* __shared__ - Data structures or codes shared between Panorama codes and VM codes.
* __content__ - [not included] Non-panorama compilables (e.g. Sounds and SoundEvents)

## Installation
1. Clone this repository.
2. Change your package name in package.json
3. Run `npm install`
4. Set GRUNT_DOTA_PATH and GRUNT_ADDON_NAME in environment or in a .env file
5. Run `grunt`
6. Run Dota 2 Workshop Tools to open your addon.

## Grunt Tasks
* Build
  * Run `grunt` to build your code and install them to your dota.
  * This task will also copy maps, models and particles folder from your dota to your project.
  
* Watch
  * Run `grunt watch` to watch your project files and build them on the fly.
  * Dota can hot reload Panorama on the fly. But you need to re-launch your addon for VM code to work.
  
* Rebuild
  * Run `grunt rebuild` to clear cache then build and install your project again.
  
* Cache
  * Run `grunt cache` to clear cache only.
  
* Clean
  * Run `grunt clean` to uninstall your addon.

## Shared Code
Since typescript can be compiled to both Panorama and VM, you can write shared code or libraries for your project. Just place your common codes inside shared folder. Shared code will be compiled to both javascript and lua.

## Event Manager
This boilerplate included a custom event manager alongwith a example for both Panorama and VM.

This event manager is included for the following reasons:
* Make it more friendly to share data between Panorama and VM.
* Correct arrays and booleans when receiving data.
* Provide custom declarations for typescript, so you can easily manage your custom events.
* See the shared typings for declarations of custom events.

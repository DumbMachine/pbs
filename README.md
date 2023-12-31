NOTE: Come back next week, under construction

<div align="center">
<img src="public/pbs-abstract.png" alt="logo"/>
<!-- <h1><b>P</b>redictable <b>B</b>rowser <b>S</b>hortcuts</h1> -->
</div>

## Predictable Browser Shortcuts

PBS, the name could be better, is a browser extension does keyboard navigation / control of webpages in an opinionated way.

That opinion being: _**C**oncatenation of **F**irst **A**lphabets_ should be a good enough shortcut for most actions on webpages. So when hints are generated, they are generated such that you already know what they will be.

It was created to serve 3 simple needs:

1. Eliminate mouse(🐁) usage
2. Using keyboard to interact with a webpage is only fast if the hints generated for the elements are not prone to entropy.
3. The shortcut hints can be plugged into another extension and then I could automate some testing at work ( thing AHK workflow to do CRUD ops on UI )

Also I lifted most of the code already from an abandoned project ( grease-monkey scripts via command pallete ). For something more stable and customizable, I would suggest:

- [Surfingkeys](https://github.com/brookhong/Surfingkeys)
- [vimium](https://github.com/philc/vimium)

## 🎬 Demo

https://github.com/DumbMachine/pbs/assets/23381512/6335d5b0-cdc7-4f52-aaee-40f6a23aa154

## How does PBS work?

While hints generated for UI elements of other extension are seemingly random

| ![surfinkey-demo-1](/assets/image.png) |
| :------------------------------------: |
|     Hints generated by Surfingkeys     |

this extension instead uses first three letter of text associated with the element as the hint.
In case there are multiple copies of the 3 letter hint, then a number is added to the hint. The numbers will be governed by the order in which the elements occur.

|  ![pbs-demo-1](/assets/image-1.png)   |
| :-----------------------------------: |
| **Hints generated by this extension** |

If no appropriate text-content can be found for a UI element, then a random generated sequence is used as a fallback.

![Alt text](/assets/random-gen.png)

## Getting Started:

Once you have the extension setup. Go to a webpage of your liking and use your first default shortcut.
_Cheatsheet_ (⌘+.), to open modal with default shortcuts available to you on any webpage.

<!-- TODO: Image example -->

<!-- hints tutorial -->

### Hints

Enable `hints` mode, by pressing `f`. This should show a shortcut on most ui elements on the page.

<!-- TODO: Image example -->

Once enabled, execute any combination of the keys visible ( there is a timeout of 1.5 seconds between each key stroke ) and should dispatch an interaction with element.

<!-- pallete tutorial -->

### Command pallete

can be used to quickly:

1. Search browser history
   https://github.com/DumbMachine/pbs/assets/23381512/0cb7396f-8dee-4bd3-8cfa-eac56b225fec

2. Search and open an active tab
   https://github.com/DumbMachine/pbs/assets/23381512/0f48524b-59bd-4fa3-976d-8f55666313a4

3. Search browser bookmarks

<!-- TODO: Image example -->

## Keyboard Bindings

These keys will be configurable in a future release.

| Keys  |      Shortcut       |                                         Description |
| ----- | :-----------------: | --------------------------------------------------: |
| `f`   |    Enable Hints     |      Enable hints on the current webpage. Will show |
| `esc` |  Escape the modal   |         Close modal ( like palletes ) or undo hints |
| `⌘+/` |    Open pallete     | A omnibar/cmd-pallete to search history/active-tabs |
| `⌘+.` | See this cheatsheet |                 See a cheatsheet with all shortcuts |
| `r`   |       Refresh       |                                refresh current page |
| `j`   |     Scroll down     |                       scrolls the page a little bit |
| `k`   |      Scroll up      |               same as above but different direction |
| `g+g` |    Scroll to up     |        scrolls to the top on the scrolling document |
| `⇧+g` |  Scroll to bottom   |     scrolls to the bottom of the scrolling document |

, legend:

- ⌘: meta key
- ⇧: shift key

## TODO:

- [ ] Caret browsing: like hints but for setting the starting point of a text selection
- [ ] Installation artifacts. The extension should be on the ff store soon.
- [ ] Test if the extension works on chrome. I don't use chrome, so I dropped the test. Unless someone raises an issue, it'll remain a todo.

<!-- ## Installation:

- Firefox 🦊:
- Others: being a FF user, it's what I've used the most. Haven't tested much on chromium-based browsers. -->

### Install from Source

<!-- `npm run build:ff` to build the app. -->

`npm run build` to build the app.
On FF:

1. Open Firefox
2. Enter "about:debugging" in the URL bar
3. Click "Load Temporary Add-on"
4. Open `manifest.json` from the `./dist` folder, from where the build was start.

On Chrome:

<!-- `npm run build:chrome` to build the app. -->

`npm run build` to build the app.

1. Navigate to chrome://extensions
2. Toggle into Developer Mode
3. Click on "Load Unpacked Extension..."
4. Open `manifest.json` from the `./dist` folder, from where the build was start.

## Security Concerns

PBS generates hints by analyzing the content of webpages and monitoring keyboard inputs. The extension's command palette utilizes data such as bookmarks, history, and open tabs to provide efficient search results.

I would recommend installing PBS directly from its source. So you can review the extension's code and modify permissions based on your security appetite.

PBS is completely free and open source and does not store / capture any information from the extension ( not even analytics ). PBS will never receive your history or any other content from your usage.

## FAQ

### Disable the extension?

Click on the PBS Icon in your Browser's toolbox. From there you can disable the extension and no keystrokes / hints / shortcuts will be tracked.

### Disable the extension, only for a some websites?

Click on the PBS Icon, while on the website, and toggle the `checkbox` next to the hostname.
This will stop the extension from listening for events on the website.

### Why does it work the way it does?

It was mostly made to suit my needs, so it probably has some rough edges. If you have any feedback / ideas, feel free to reachout.

## Release Notes

See [CHANGELOG](https://www.youtube.com/watch?v=dQw4w9WgXcQ) for the major changes in each release.

## License

`TODO`

## Credits:

- [Surfingkeys](https://github1s.com/brookhong/Surfingkeys): inspiration for the idea. also code for finding clickable UI elements

- [github1s](https://github1s.com/): even after github's ui updates, this is hands down the best way of reading a repository.

- [textstudio](https://www.textstudio.com): used to generate the icon

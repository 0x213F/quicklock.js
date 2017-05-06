# quicklock.js

Every time a user leaves a webpage it will lock. To unlock the page
the user must confirm their identity with a PIN.

Consider a web application where highly sensitive information is presented to the user. In order to add an extra security factor, the application could lock whenever the window is de-focused (changed tab, the window is de-focused an AJAX request will be sent to a server to indicate that the page has been “locked” and the DOM will be cleared. The page will show a phone-style pin pad so that the user can unlock the webpage with their custom PIN (which will be initialized from a different interface). To unlock the webpage, an AJAX request is sent to the server. If there is a password match, then the contents of the DOM must be rebuilt and page “unlocked”.

### Installing

```
npm install password-hash
npm install express
npm install path
```

## Running the Demo

```
node server.js <username> <password> <PIN> <# of allowed PIN attempts> <connection interval>
```

### Usage


## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Author

* **Joshua Schultheiss** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

## Acknowledgments

* [John Bambenek](http://www.bambenekconsulting.com) and his [cyber security lab](https://courses.engr.illinois.edu/cs460/sp2010/).

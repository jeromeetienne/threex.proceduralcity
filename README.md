threex.proceduralcity.js
========================

It is a three.js extension to display a fully procedural city based on 
["city"](http://www.mrdoob.com/lab/javascript/webgl/city/01/)
, a  demo [recently released](https://twitter.com/mrdoob/status/350730133319073792) by 
[@mrdoob](http://mrdoob.com).
You can try a
[demo live](http://jeromeetienne.github.io/threex.proceduralcity/examples/demo.html)
and check its 
[source](https://github.com/jeromeetienne/threex.proceduralcity/blob/master/examples/demo.html).
Here is a 
[more basic example](http://jeromeetienne.github.io/threex.proceduralcity/examples/basic.html) 
and its
[source](https://github.com/jeromeetienne/threex.proceduralcity/blob/master/examples/basic.html).

NOTE: see full implementation details in 
["How to Do a Procedural City in 100 Lines"](http://learningthreejs.com/blog/2013/08/02/how-to-do-a-procedural-city-in-100lines/)
post from 
[learningthreejs blog](http://learningthreejs.com/).

## How To Install It

You can install it manually or with
[bower](http://bower.io/).
for the manual version, first include ```threex.proceduralcity.js``` with the usual

```html
<script src='threex.proceduralcity.js'></script>
```

or with
[bower](http://bower.io/) 
you type the following to install the package.

```bash
bower install -s threex.proceduralcity=https://github.com/jeromeetienne/threex.proceduralcity/archive/master.zip
```

then you add that in your html

```html
<script src="bower_components/threex.rendererstats/threex.rendererstats.js"></script>
```

## How To Use It

Super simple, just create an instance and it will return a ```THREE.Mesh```

```javascript
var city  = new THREEx.ProceduralCity()
scene.add(city) 
```

The [demo live](http://jeromeetienne.github.io/threex.proceduralcity/examples/demo.html)
contains this city plus a ground, a first personn controls and a fog.
This is rather cool result for as little effort.



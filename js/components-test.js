(function() {
    console.log("components-test.js [loaded]");

    var testObject = new plexus.GameObject();
    testObject.addComponent(new plexus.components.Input);
    testObject.addComponent(new plexus.components.Physics);

    console.log(JSON.stringify(testObject, null, 4));

    plexus.GameSystem.getInstance().addObject(testObject);

})();

// vi: ft=javascript sw=4 ts=4 et :

(function() {
    console.log("components-test.js [loaded]");

    var heroEntity = new plexus.GameEntity();
    heroEntity.addComponent(new plexus.components.Health());
    heroEntity.addComponent(new plexus.components.Transform());

    console.log("HeroEntity's AST: ", heroEntity);
    heroEntity.print();

})();

// vi: ft=javascript sw=4 ts=4 et :

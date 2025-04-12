window._unlockingAllLevels = false;

function unlockAllLevels(){
    window._unlockingAllLevels = true;
}

window.addEventListener("load", function(){
    var __extends = document.getElementById("gameFrame").contentWindow.__extends;
    var Engine = document.getElementById("gameFrame").contentWindow.Engine;
    var Game = document.getElementById("gameFrame").contentWindow.Game;

    Game.STRONG_TOUCH_MUTE_CHECK = false;

    try{
        Game.apiEnabled = typeof parent !== 'undefined' && typeof parent.cmgGameEvent !== 'undefined';
    }
    catch(e){
        Game.apiEnabled = false;
    }

    var PATH_SPLASH = "../FilesCoolMathGames/splash.png";
    //var URL_CRAZY_GAMES = null;

    var textureIntro = null;

    var Intro = /** @class */ (function (_super) {
        __extends(Intro, _super);

        var removeBodyElement = function(id){
            var elem = document.getElementById(id);
            return elem.parentNode.removeChild(elem);
        }

        function Intro(){
            var _this = _super.call(this) || this;
            
            _this.createMap("None", "Sky None");
            var x = Game.Scene.xSizeLevel * 0.5;
            var y = Game.Scene.ySizeLevel * 0.5;
            Engine.Renderer.camera(x, y);



            
            textureIntro = new Engine.Texture(PATH_SPLASH, false, true);
            //textureIntro.preserved = true;


            Engine.Renderer.clearColor(textureIntro.getRed(0, 0) / 255, textureIntro.getGreen(0, 0) / 255, textureIntro.getBlue(0, 0) / 255);


            var introSprite = new Engine.Sprite();
            introSprite.preserved = false;
            introSprite.owner = null
            introSprite.setFull(true, true, textureIntro, Engine.Renderer.xSizeViewIdeal, Engine.Renderer.ySizeViewIdeal, 0, 0, 0, 0, 640, 480);
            introSprite.x = -introSprite.xSize * 0.5;
            introSprite.y = -introSprite.ySize * 0.5;
            introSprite.onDrawText = function(){
                introSprite.render();
            };

            Engine.System.addListenersFrom(introSprite);

            Game.Scene.fade.speed = 0;
            //Game.Scene.fade.speed = 0.0166666666666667;
            
           setTimeout(function(){
                Game.Scene.fade.speed = 0.0166666666666667;
                setTimeout(function(){
                    Game.Scene.fade.direction = 1;
                    setTimeout(function(){
                        setTimeout(function(){
                            Game.Scene.nextSceneClass = Game.MainMenu;
                        }, 800);
                    }, 1200);
                }, 3200);
            }, 800);
            
            return _this;
        }
        Intro.prototype.onStepUpdate = function(){
            _super.prototype.onStepUpdate.call(this);
        };
        return Intro;
    }(Game.Scene));

    Game.addPath("load", PATH_SPLASH);

    Game.addAction("beforeanything", function(){
        //Game.OPTIMIZE_EMISSION = true;
        //Game.OPTIMIZE_TRANSPARENCY = true;
    });

    Game.addAction("postinit", function(){
        Game.startingSceneClass = Intro;
        Game.HAS_LINKS = false;
        Game.FORCE_EDGE_TUTORIAL = true;
    });

    Game.addAction("start", function(){
        var levelUnlocker = {};
        levelUnlocker.owner = null;
        levelUnlocker.preserved = true;
        levelUnlocker.onStepUpdate = function(){
            if(!Game.allLevelsUnlocked && window._unlockingAllLevels){
                for(var i = 0; i < 28; i += 1){
                    if(Game.levelStates[i] == ""){
                        Game.levelStates[i] = "unlocked";
                        Engine.Data.save("Level " + i, "unlocked", 60);
                    }
                }
                Game.allLevelsUnlocked = true;
                levelUnlocker.preserved = false;
            }
        };
        Engine.System.addListenersFrom(levelUnlocker);
    });

    Game.addAction("playbutton", function(){
        if(Game.apiEnabled){
            // parent.cmgGameEvent("start");
        }
        else{
            console.log("start");
        }
    });
    Game.addAction("playlevelbutton", function(){
        if(Game.apiEnabled){
            // parent.cmgGameEvent("start", Game.Level.nextIndex + "");
        }
        else{
            console.log("start " + Game.Level.nextIndex);
        }
    });
    Game.addAction("resetlevelbutton", function(){
        if(Game.apiEnabled){
            // parent.cmgGameEvent("replay", Game.Level.index + "");
        }
        else{
            console.log("replay " + Game.Level.index);
        }
    });

    Engine.System.run();
});


function CHammer(oParentContainer){
    var _iState = 0;
    var _oHammer;
    var _oHammerSprite;
    
    this._init = function(oParentContainer){
        _oHammerSprite = {        
                    images: [s_oSpriteLibrary.getSprite('hammer')], 
                    // width, height & registration point of each sprite
                    frames: {width: HAMMER_WIDTH, height: HAMMER_HEIGHT, regX: HAMMER_WIDTH/2, regY: HAMMER_HEIGHT}, 
                    animations: {start_0:0, hit_0:[0, 6, "stop_0"],stop_0:6,start_1:7,hit_1:[7,13,"stop_1"],stop_1:13}
                };
                
                
        var oSpriteSheetHammer = new createjs.SpriteSheet(_oHammerSprite);
        _oHammer = createSprite(oSpriteSheetHammer, "start_"+_iState, HAMMER_WIDTH/2, HAMMER_HEIGHT, HAMMER_WIDTH, HAMMER_HEIGHT);
        _oHammer.x = 1800;
        _oHammer.y = 525;
        _oHammer.alpha = 0;
        oParentContainer.addChild(_oHammer);
    };
    
    this.unload = function(){
        createjs.Tween.removeAllTweens();
        oParentContainer.removeAllChildren(); 
    };
    
    this._showHammer = function(iRow, iCol){
        _oHammer.y = iRow + 40;
        _oHammer.x = iCol + 100;
        _oHammer.visible = true;
        _oHammer.alpha = 1
        _oHammer.gotoAndPlay("hit_"+_iState);
        
        createjs.Tween.get(_oHammer ).wait(200).to({alpha: 0 }, 400);
    };
    
    this.setState = function(iState){
        _iState = iState;
    };
    
    this._init(oParentContainer);
    
}
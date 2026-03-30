function CCharacter(iX,iY,iIndex,oParentContainer){
    
    var _oSprite;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY,iIndex){
        var oData = {   
                    images: [s_oSpriteLibrary.getSprite('character_'+iIndex)], 
                    // width, height & registration point of each sprite
                    frames: {width: CHARACTER_WIDTH[iIndex], height: CHARACTER_HEIGHT[iIndex], regX: CHARACTER_WIDTH[iIndex]/2, regY: CHARACTER_HEIGHT[iIndex]}, 
                    animations: {start:0, idle:[0, 16, "idle"], hit:[17,29,"hit_stop"],hit_stop:[29]}
                };
                
        var oSpriteSheetCharacter = new createjs.SpriteSheet(oData);
        _oSprite = createSprite(oSpriteSheetCharacter, "start", CHARACTER_WIDTH[iIndex]/2, CHARACTER_HEIGHT[iIndex], CHARACTER_WIDTH[iIndex], CHARACTER_HEIGHT[iIndex]);
        _oSprite.x = iX;
        _oSprite.y = iY;
        _oParentContainer.addChild(_oSprite);
    };
    
    this.playAnim = function(szAnim){
        _oSprite.gotoAndPlay(szAnim);
    };
    
    this.getX = function(){
        return _oSprite.x;
    };
    
    this.getY = function(){
        return _oSprite.y;
    };
    
    this._init(iX,iY,iIndex);
}
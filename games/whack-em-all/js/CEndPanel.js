function CEndPanel(){
    var _iStartY;
    var _oListener;
    var _oFade;
    var _oGroup;
    
    var _oMsgTextBack;
    var _oScoreTextBack;
    var _oMsgText;
    var _oScoreText;
    var _oBestScoreText;
    var _oBestScoreTextBack;
    var _oButHome;
    var _oButRestart;
    var _oPanelContainer;
    var _oThis;
    
    this._init = function(){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oListener = _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        _oPanelContainer = new createjs.Container();   
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = _iStartY = - oSprite.height/2;    
        
        _oMsgTextBack = new CTLText(_oPanelContainer, 
                    -250, -140, 500, 76, 
                    76, "center", "#000", FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        
        _oMsgTextBack.setOutline(6);

        
        _oMsgText = new CTLText(_oPanelContainer, 
                    -250, -140, 500, 76, 
                    76, "center", "#ffb557", FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    

        
        _oScoreTextBack = new CTLText(_oPanelContainer, 
                    -250, -30, 500, 45, 
                    45, "center", "#000", FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    
        _oScoreTextBack.setOutline(4);
        
        _oScoreText = new CTLText(_oPanelContainer, 
                    -250, -30, 500, 45, 
                    45, "center", "#ffb557", FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );

        
        _oBestScoreTextBack = new CTLText(_oPanelContainer, 
                    -250, 20, 500, 45, 
                    45, "center", "#000", FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    
        _oBestScoreTextBack.setOutline(4);
        
        _oBestScoreText = new CTLText(_oPanelContainer, 
                    -250, 20, 500, 45, 
                    45, "center", "#ffb557", FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    

        
        _oButHome = new CGfxButton( -200 ,170,s_oSpriteLibrary.getSprite('but_home'),_oPanelContainer);
        _oButHome.addEventListener(ON_MOUSE_UP, this._onHome, this, 0);
        
        _oButRestart = new CGfxButton( 200 ,170,s_oSpriteLibrary.getSprite('but_restart'),_oPanelContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this, 0);
    };
    
    this.unload = function(){
        _oButHome.unload();
        _oButRestart.unload();
        _oFade.off("click",_oListener);
        
        s_oStage.removeChild(_oGroup);
    };
    
    this.show = function(iScore){
	playSound("game_over",1,false);
        
        _oMsgTextBack.refreshText(TEXT_GAMEOVER);
        _oScoreTextBack.refreshText(TEXT_SCORE + " " + iScore);
        _oMsgText.refreshText(TEXT_GAMEOVER);
        _oScoreText.refreshText(TEXT_SCORE + " " + iScore);
        _oBestScoreText.refreshText(TEXT_BEST_SCORE + " " + s_iBestScore);
        _oBestScoreTextBack.refreshText(TEXT_BEST_SCORE + " " + s_iBestScore);
        
        _oGroup.visible = true;
        
        _oFade.alpha = 0;
        _oPanelContainer.y = _iStartY;
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2},1000, createjs.Ease.bounceOut);
        
        $(s_oMain).trigger("share_event",iScore);
        $(s_oMain).trigger("save_score",[iScore]);
        $(s_oMain).trigger("end_session");
    };

    this._onHome = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        s_oGame.onConfirmExit();
    };
    
    this._onRestart = function(){
        s_oMain.pokiShowCommercial( ()=>{
            $(s_oMain).trigger("show_interlevel_ad");
            _oGroup.visible = false;
            s_oGame._init();
        });
    };
    
    _oThis = this;
    this._init();
    
    return this;
}

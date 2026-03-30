function CHelp(){
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oStart;
    
    var _oBgHelp;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oButExit;
    var _oPanelContainer;
    
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosExit;
    
    this._init = function(){

        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(oBg);
        
        _oPanelContainer = new createjs.Container();
        _oPanelContainer.x = CANVAS_WIDTH/2;
        s_oStage.addChild(_oPanelContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_help')
        _oBgHelp = createBitmap(oSpriteBg);
        _oBgHelp.regX = oSpriteBg.width/2;
        _oBgHelp.regY = oSpriteBg.height/2;
        _oPanelContainer.addChild(_oBgHelp);
        
        
        _oPanelContainer.y = -oSpriteBg.height/2;
        var oSpriteStart = s_oSpriteLibrary.getSprite('but_start_game');
        _oStart = new CGfxButton(  240,170,oSpriteStart,_oPanelContainer);
        _oStart.addEventListener(ON_MOUSE_UP, this._onStart, this, 0);
        _oStart.pulseAnimation();
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)-10, y: (oSprite.height/2)+10 };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - oSprite.width/2 - 10, y: _pStartPosExit.y};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        
        /////////////CHARACTER 1
        var oCharacter = new CCharacter(-250,-40,0,_oPanelContainer);
        oCharacter.playAnim("idle");
        
        var oSpriteScoreBg = s_oSpriteLibrary.getSprite("score_panel_help");
        
        var oScorePanel =  createBitmap(oSpriteScoreBg);
        oScorePanel.regX = oSpriteScoreBg.width/2;
        oScorePanel.x = oCharacter.getX();
        oScorePanel.y = oCharacter.getY() - 30;
        _oPanelContainer.addChild(oScorePanel)
        
        
        var szText = ""
        if(CHARACTER_POINTS[0] > 0){
            szText = "+"
        }
        
        szText += CHARACTER_POINTS[0];
        var oScoreNum = new CTLText(_oPanelContainer, 
                    oCharacter.getX()-68, oScorePanel.y + 16, 136, 50, 
                    50, "center", "#ffcb00", FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );
                    
        
        
        /////////////CHARACTER 2
        var oCharacter = new CCharacter(0,-40,1,_oPanelContainer);
        oCharacter.playAnim("idle");
        
        var oScorePanel =  createBitmap(oSpriteScoreBg);
        oScorePanel.regX = oSpriteScoreBg.width/2;
        oScorePanel.x = oCharacter.getX();
        oScorePanel.y = oCharacter.getY() - 30;
        _oPanelContainer.addChild(oScorePanel)
        
        var szText = ""
        if(CHARACTER_POINTS[1] > 0){
            szText = "+"
        }
        
        szText += CHARACTER_POINTS[1];
        var oScoreNum = new CTLText(_oPanelContainer, 
                    oCharacter.getX()-68, oScorePanel.y + 16, 136, 50, 
                    50, "center", "#ffcb00", FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );
                    
       
       
       /////////////CHARACTER 3
       var oCharacter = new CCharacter(250,-40,2,_oPanelContainer);
        oCharacter.playAnim("idle");
        
        var oScorePanel =  createBitmap(oSpriteScoreBg);
        oScorePanel.regX = oSpriteScoreBg.width/2;
        oScorePanel.x = oCharacter.getX();
        oScorePanel.y = oCharacter.getY() - 30;
        _oPanelContainer.addChild(oScorePanel)
        
        var szText = ""
        if(CHARACTER_POINTS[2] > 0){
            szText = "+"
        }
        
        szText += CHARACTER_POINTS[2];
        var oScoreNum = new CTLText(_oPanelContainer, 
                    oCharacter.getX()-68, oScorePanel.y + 16, 136, 50, 
                    50, "center", "#ffcb00", FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );
                    

      
      
      /////////////CHARACTER 4
        var oCharacter = new CCharacter(-250,220,3,_oPanelContainer);
        oCharacter.playAnim("idle");

        
        var oScorePanel =  createBitmap(oSpriteScoreBg);
        oScorePanel.regX = oSpriteScoreBg.width/2;
        oScorePanel.x = oCharacter.getX();
        oScorePanel.y = oCharacter.getY() - 30;
        _oPanelContainer.addChild(oScorePanel)
        
        var szText = ""
        if(CHARACTER_POINTS[3] > 0){
            szText = "+"
        }
        
        szText += CHARACTER_POINTS[3];
        var oScoreNum = new CTLText(_oPanelContainer, 
                    oCharacter.getX()-68, oScorePanel.y + 16, 136, 50, 
                    50, "center", "#ffcb00", FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );
                    

        
        
        
        /////////////CHARACTER 5
        var oCharacter = new CCharacter(0,220,4,_oPanelContainer);
        oCharacter.playAnim("idle");

        
        var oScorePanel =  createBitmap(oSpriteScoreBg);
        oScorePanel.regX = oSpriteScoreBg.width/2;
        oScorePanel.x = oCharacter.getX();
        oScorePanel.y = oCharacter.getY() - 30;
        _oPanelContainer.addChild(oScorePanel)
        
        var szText = ""
        if(CHARACTER_POINTS[4] > 0){
            szText = "+"
        }
        
        szText += CHARACTER_POINTS[4];
        var oScoreNum = new CTLText(_oPanelContainer, 
                    oCharacter.getX()-68, oScorePanel.y + 16, 136, 50, 
                    50, "center", "#ff1800", FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );
                    
        
        createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2},1000, createjs.Ease.bounceOut);
        
        this.refreshButtonPos();
    };  
    
    this.unload = function(){
        _oStart.unload();  
        _oButExit.unload();
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oHelp = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX, s_iOffsetY + _pStartPosAudio.y);
        }   
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,s_iOffsetY + _pStartPosExit.y);
    };
    
    this._onStart = function(){
        s_oHelp.unload();
        s_oMain.gotoGame();
    };
    
    this._onMenu = function(){
        s_oHelp.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };
        
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
          
    this._onExit = function(){
        s_oHelp.unload();
        s_oMain.gotoMenu();
    };
    
    s_oHelp = this;        
    this._init();   
};

var s_oHelp = null;
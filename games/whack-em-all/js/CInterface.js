function CInterface(){
    
    var _iMaskWidth;
    var _iMaskHeight;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oButTimer;
    var _oButExit;
    var _oScoreNum;
    var _oScoreNumShadow;
    var _oTimeNumBack;
    var _oBestScoreNumShadow;
    var _oBestScoreNum;
    var _oTimeNum;
    var _oTimerBg;
    var _oTimerFill;
    var _oTextMult;
    var _oTextMultOutline;
    var _oMask;
    var _oContainerTimer;
    var _oContainerScore;
    var _oContainerBestScore;
    var _oSuperHammerText;
    var _oHammerIcon;
    
    
    var _oHelpPanel=null;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    
    this._init = function(){                  
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)-10, y: (oSprite.height/2)+10 };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _oButExit.getX() - oSprite.width/2 -10, y: (oSprite.height/2)+10 };
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
            
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width/2 - 10,y:(oSprite.height/2) + 10};
        }else{
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x: _oButExit.getX() - oSprite.width/2 -10, y: (oSprite.height/2)+10 };
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        
        //CONTAINER TIMER
        _oContainerTimer =  new createjs.Container();
        _oContainerTimer.x = TIME_X;
        _oContainerTimer.y = TIME_Y;
        s_oStage.addChild(_oContainerTimer);
        
        
        var oSpriteTimeBarBg = s_oSpriteLibrary.getSprite('bg_timebar');
        _oTimerBg = createBitmap(oSpriteTimeBarBg);
        _oContainerTimer.addChild(_oTimerBg);
        
        var oSpriteTimeBarBg = s_oSpriteLibrary.getSprite('fill_timebar');
        
        _oTimerFill = createBitmap(oSpriteTimeBarBg);
        _oTimerFill.x = 2;
        _oTimerFill.y = 3;
        _oContainerTimer.addChild(_oTimerFill);
        
        var oSpriteTimeBarFg = s_oSpriteLibrary.getSprite('timebar_frame');
        var oTimerFG = createBitmap(oSpriteTimeBarFg);
        _oContainerTimer.addChild(oTimerFG);
        
        var oTimeIcon = createBitmap(s_oSpriteLibrary.getSprite("time_icon"));
        _oContainerTimer.addChild(oTimeIcon);
        
        _oTimeNumBack = new createjs.Text("00:00","40px "+FONT, "#000");
        _oTimeNumBack.x = oSpriteTimeBarBg.width/2;
        _oTimeNumBack.y = oSpriteTimeBarBg.height/2 - 4;
        _oTimeNumBack.textAlign = "center";
        _oTimeNumBack.textBaseline = "middle";
        _oTimeNumBack.lineWidth = 200;
        _oTimeNumBack.outline = 5;
        _oContainerTimer.addChild(_oTimeNumBack);
        
        _oTimeNum = new createjs.Text("00:00","40px "+FONT, "#ffb557");
        _oTimeNum.x = oSpriteTimeBarBg.width/2;
        _oTimeNum.y = oSpriteTimeBarBg.height/2 - 4;
        _oTimeNum.textAlign = "center";
        _oTimeNum.textBaseline = "middle";
        _oTimeNum.lineWidth = 200;
        _oContainerTimer.addChild(_oTimeNum);
        
        _iMaskWidth = oSpriteTimeBarBg.width;
        _iMaskHeight = oSpriteTimeBarBg.height;
        
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(2, 3, _iMaskWidth, _iMaskHeight);
        _oContainerTimer.addChild(_oMask);
        
        _oTimerFill.mask = _oMask;
        
        
        //SCORE CONTAINER
        _oContainerScore = new createjs.Container();
        _oContainerScore.x = SCORE_X;
        _oContainerScore.y = SCORE_Y;
        s_oStage.addChild(_oContainerScore);
        
        
        var oSpriteTimeBarBg = s_oSpriteLibrary.getSprite('score_bg');
        var oScoreBg = createBitmap(oSpriteTimeBarBg);
        _oContainerScore.addChild(oScoreBg);
        
       
        _oScoreNumShadow = new CTLText(_oContainerScore, 
                    oSpriteTimeBarBg.width/2-65, oSpriteTimeBarBg.height/2-24, 140, 40, 
                    40, "right", "#000", FONT, 1.1,
                    0, 0,
                    "0",
                    true, true, false,
                    false );
                    
        _oScoreNumShadow.setOutline(5);
        
        _oScoreNum = new CTLText(_oContainerScore, 
                    oSpriteTimeBarBg.width/2-65, oSpriteTimeBarBg.height/2-24, 140, 40, 
                    40, "right", "#ffb557", FONT, 1.1,
                    0, 0,
                    "0",
                    true, true, false,
                    false );
          

        
        var oSpriteHammerIcon = s_oSpriteLibrary.getSprite('hammer_icon')
        var oData = {   
                        images: [oSpriteHammerIcon], 
                        // width, height & registration point of each sprite
                        frames: {width: oSpriteHammerIcon.width/2, height: oSpriteHammerIcon.height}, 
                        animations: {state_0:[0],state_1:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
         
        _oHammerIcon = createSprite(oSpriteSheet,"state_0", 0,0,oSpriteHammerIcon.width/2, oSpriteHammerIcon.height);
        _oHammerIcon.x = -12;
        _oHammerIcon.y = 0;
        _oContainerScore.addChild(_oHammerIcon);
     
        _oTextMultOutline = new createjs.Text("","30px "+FONT, "#000");
        _oTextMultOutline.x = _oHammerIcon.x + 40;
        _oTextMultOutline.y = _oHammerIcon.y + 60;
        _oTextMultOutline.textAlign = "center";
        _oTextMultOutline.textBaseline = "alphabetic";
	_oTextMultOutline.outline = 3;
        _oContainerScore.addChild(_oTextMultOutline);
        
        _oTextMult = new createjs.Text("","30px "+FONT, "#ffb557");
        _oTextMult.x = _oHammerIcon.x + 40;
        _oTextMult.y = _oHammerIcon.y + 60;
        _oTextMult.textAlign = "center";
        _oTextMult.textBaseline = "alphabetic";
        _oContainerScore.addChild(_oTextMult);
     
     
        //BEST SCORE CONTAINER
        _oContainerBestScore = new createjs.Container();
        _oContainerBestScore.x = BEST_SCORE_X;
        _oContainerBestScore.y = BEST_SCORE_Y;
        s_oStage.addChild(_oContainerBestScore);
        
        
        var oSpriteTimeBarBg = s_oSpriteLibrary.getSprite('score_bg');
        var oScoreBg = createBitmap(oSpriteTimeBarBg);
        _oContainerBestScore.addChild(oScoreBg);
        
       
        _oBestScoreNumShadow = new CTLText(_oContainerBestScore, 
                    oSpriteTimeBarBg.width/2-65, oSpriteTimeBarBg.height/2-24, 140, 40, 
                    40, "center", "#000", FONT, 1.1,
                    0, 0,
                    s_iBestScore,
                    true, true, false,
                    false );
                    
        _oBestScoreNumShadow.setOutline(5);
        
        _oBestScoreNum = new CTLText(_oContainerBestScore, 
                    oSpriteTimeBarBg.width/2-65, oSpriteTimeBarBg.height/2-24, 140, 40, 
                    40, "center", "#ffb557", FONT, 1.1,
                    0, 0,
                    s_iBestScore,
                    true, true, false,
                    false );
                    

        
        var oBestIcon = createBitmap(s_oSpriteLibrary.getSprite("best_icon"));
        oBestIcon.x = -12;
        oBestIcon.y = 7;
        _oContainerBestScore.addChild(oBestIcon);

        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        if(_oHelpPanel!==null){
            _oHelpPanel.unload();
        }
        s_oInterface = null;
    };
        
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }   
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this.setButVisible = function(bVal){
        _oButTimer.setVisible(bVal);
    };
    
    this.refreshTime = function(iValue){
	_oMask.scaleX = iValue;
    };
    
    this.refreshTimeText = function(iValue){
        _oTimeNum.text = iValue;
        _oTimeNumBack.text = iValue;
    };
    
    this.refreshScore = function(iValue){
        _oScoreNumShadow.refreshText(iValue);
        _oScoreNum.refreshText(iValue);
    };

    this.refreshBestScore = function(){
        _oBestScoreNumShadow.refreshText(s_iBestScore);
        _oBestScoreNum.refreshText(s_iBestScore);
    };
    
    this.showSuperHammer = function(){
        _oHammerIcon.gotoAndStop("state_1");
        _oTextMultOutline.text = "x2";
        _oTextMult.text = "x2";
        
        var oSprite = s_oSpriteLibrary.getSprite('superhammer');
        _oSuperHammerText = createBitmap(oSprite);
        _oSuperHammerText.regX = oSprite.width/2;
        _oSuperHammerText.regY = oSprite.height/2;
        _oSuperHammerText.x = CANVAS_WIDTH/2;
        _oSuperHammerText.y = - oSprite.height;
        s_oStage.addChild(_oSuperHammerText);
        
        createjs.Tween.get(_oSuperHammerText).to({y: s_iOffsetY+300}, (600), createjs.Ease.cubicOut).call(function() {
                                                    createjs.Tween.get(_oSuperHammerText).wait(1000).to({y: - oSprite.height}, (600), createjs.Ease.cubicOut).call(function() {
                                                        s_oStage.removeChild(_oSuperHammerText);
            
                                                    });
                                            });
                                            
        playSound("superhammer",1,false);
    };
    
    this.hideSuperHammer = function(){
        _oHammerIcon.gotoAndStop("state_0");
        s_oStage.removeChild(_oSuperHammerText);
        _oTextMultOutline.text = "";
        _oTextMult.text = "";
    };
    
    this._onRestart = function(){
        s_oGame.restartGame();
    };
    
    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        s_oGame.onExit();
        //s_oGame.onExit();  
        //
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
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;
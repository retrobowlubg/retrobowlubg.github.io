function CMenu(){
    var _bUpdate;
    var _iTimeElaps;
    var _aCharacter;
    
    var _oStart;
    var _oCreditsBut;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oBg;
    var _oAudioToggle;
    var _oButFullscreen;
    
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    
    this._init = function(){
        _bUpdate = false;
        _iTimeElaps = 0;
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
        
        var oModePos = {x: CANVAS_WIDTH/2, y: 875};
        
        var oSpriteStart = s_oSpriteLibrary.getSprite('but_play');
        _oStart = new CGfxButton(oModePos.x,oModePos.y,oSpriteStart,s_oStage);
        _oStart.addEventListener(ON_MOUSE_UP, this._onStart, this, 0);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2) - 10, y: (oSprite.height/2) + 10};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);    
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x: (oSprite.width/2) + 10, y: (oSprite.height/2) + 10};            
        _oCreditsBut = new CGfxButton(_pStartPosCredits.x,_pStartPosCredits.y,oSprite, s_oStage);
        _oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        this._initHole();
        
        
        
        var oBestScoreTextBack = new createjs.Text(TEXT_BEST_SCORE + " " + s_iBestScore," 45px "+FONT, "#000");
        oBestScoreTextBack.x = CANVAS_WIDTH/2;
        oBestScoreTextBack.y = CANVAS_HEIGHT/2 - 340;
        oBestScoreTextBack.textAlign = "center";
        oBestScoreTextBack.textBaseline = "alphabetic";
        oBestScoreTextBack.outline = 6;
        s_oStage.addChild(oBestScoreTextBack);
        
        var oBestScoreText = new createjs.Text(TEXT_BEST_SCORE + " " + s_iBestScore," 45px "+FONT, "#ffb557");
        oBestScoreText.x = CANVAS_WIDTH/2;
        oBestScoreText.y = CANVAS_HEIGHT/2 - 340;
        oBestScoreText.textAlign = "center";
        oBestScoreText.textBaseline = "alphabetic";
        s_oStage.addChild(oBestScoreText);
        
        
        
        if(!s_bStorageAvailable){
            new CMsgBox();
        }else{
            var iBestScore = getItem("whackemall_best_score");
            if(iBestScore !== null ){
                s_iBestScore = iBestScore;
            }
        }
        
        this.refreshButtonPos();
        
        _bUpdate = true;
    };  
    
    this.unload = function(){
        _bUpdate = false;
        _oStart.unload();
        _oCreditsBut.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
        s_oMenu = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oCreditsBut.setPosition(_pStartPosCredits.x + s_iOffsetX,s_iOffsetY + _pStartPosCredits.y);
         
        if(s_bLandscape){
            _oStart.setPosition(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 280);
            _oStart.setScale(0.8);
        }else{
            _oStart.setPosition(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 400);
            _oStart.setScale(1);
        }
        
    };
    
    this._initHole = function(){
        var aPosHoles = [{x:648,y:930},{x:1240,y:930},{x:648,y:1100},{x:1240,y:1100},{x:648,y:1285},{x:1240,y:1285}];
        
        _aCharacter = new Array();
        for(var i=0;i<6;i++){
            var oCharacter = new CCharacterInHole(aPosHoles[i].x,aPosHoles[i].y,s_oStage);
            _aCharacter[i] = oCharacter;
        }
    };
    
    this.spawnCharacter = function(){
        do{
            var iRandHole = Math.floor(Math.random()*6);
        }while(_aCharacter[iRandHole].getValue());
        var iRandCharacter = Math.floor(Math.random()*4);
        var iRandTime = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        
        _aCharacter[iRandHole].spawnCharacter(iRandCharacter,iRandTime,500);  
    };
    
    this._onStart = function(){
        s_oMain.pokiShowCommercial(()=>{
            $(s_oMain).trigger("start_session");
            s_oMenu.unload();
            s_oMain.gotoHelp();
        });
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onCreditsBut = function(){
        new CCreditsPanel();
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
    
    this.update = function(){
        if(_bUpdate === false){
            return; 
        }
        
        _iTimeElaps += s_iTimeElaps;
        if(_iTimeElaps > 500){
            _iTimeElaps = 0;
            this.spawnCharacter();
        }
    };
    
    s_oMenu = this;        
    this._init();
    
    
};

var s_oMenu = null;
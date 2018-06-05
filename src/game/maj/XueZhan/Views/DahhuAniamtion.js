var XueZhanDahuAnim = MJDahuAniBase.extend({
	ctor: function (huData) {
		this._super(huData);
		
		this.sprite_hu_word = new ccui.ImageView('res/Game/Maj/XueZhan/Resoures/large/xuezhan_hu_xiaohu.png', ccui.Widget.LOCAL_TEXTURE);
		var size = this.sprite_hu_word.getContentSize();
		this.setContentSize(size);
		this.sprite_hu_word.setPosition(size.width * 0.5, size.height * 0.5);
		this.addChild(this.sprite_hu_word);
		this.setVisible(false);
	}

});



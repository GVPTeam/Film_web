var imf = function () {
	var lf = 0;
	var instances = [];
	
	//定义一个通过class获得元素的方法
	function getElementsByClass (object, tag, className) {
		var o = object.getElementsByTagName(tag);
		for ( var i = 0, n = o.length, ret = []; i < n; i++)
			if (o[i].className == className) ret.push(o[i]);
		if (ret.length == 1) ret = ret[0];
		return ret;
	}

	//添加事件
	/* 
        兼容性
		给一个事件指派多个处理过程的,分别适用于不同的浏览器类型。
		addEventListener(事件类型, 处理函数, 使用捕获);
		attachEvent('on'+事件类型，处理函数)
	*/
	function addEvent (o, e, f) {
		if (window.addEventListener) o.addEventListener(e, f, false);
		else if (window.attachEvent) r = o.attachEvent('on' + e, f);
	}


	//创建倒影
	function createReflexion (cont, img) {
		var flx = false;
		if (document.createElement("canvas").getContext) {
			flx = document.createElement("canvas");
			flx.width = img.width;
			flx.height = img.height;

			////getContext返回一个用于在画布上绘图的环境，使用它可以绘制到 Canvas 元素中。
			var context = flx.getContext("2d");	
			
			//translate(x,y):平移。将 “画布的坐标原点” 向左右方向移动x，向上下方向移动y，这里即原点在y轴上移动img.height位置。
			context.translate(0, img.height);	
			
			//scale（x,y）：扩大。x为水平方向的放大倍数，y为竖直方向的放大倍数，这里即沿y轴翻转.
			context.scale(1, -1.2);
			
			/*
                context.drawImage(img,x,y,width,height)
			    img    规定要使用的图像、画布或视频。
			    x	   在画布上放置图像的 x 坐标位置。
			    y	   在画布上放置图像的 y 坐标位置。
			    width  可选。要使用的图像的宽度（伸展或缩小图像）。
			    height 可选。要使用的图像的高度（伸展或缩小图像）。
			*/
			context.drawImage(img, 0, 0, img.width, img.height);

			//设置或返回新图像如何绘制到已有的图像上
			//destination-out在源图像之外显示目标图像。只有源图像之外的目标图像部分会被显示，源图像是透明的。
			context.globalCompositeOperation = "destination-out";
			
			//创建线性渐变（用在画布内容上）
			var gradient = context.createLinearGradient(0, 0, 0, img.height *3);
			gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
			gradient.addColorStop(0, "rgba(255, 255, 255, 1)");

			//设置或返回用于填充绘画的颜色、渐变或模式
			context.fillStyle = gradient;
			context.fillRect(0, 0, img.width, img.height * 3);
		} else {
			/* ---- DXImageTransform ---- */
			/* 
                用ie提供的css渲染 
			    AlphaImageLoader：在元素的背景和内容之间插入一张图片，并提供对此图片的剪切和改变尺寸的操作。
			    如果载入的是PNG(Portable Network Graphics)格式，则0%-100%的透明度也被提供。
			    语法格式：filter : progid:DXImageTransform.Microsoft.AlphaImageLoader ( 
			    enabled=bEnabled , sizingMethod=sSize , src=sURL )
			*/
			flx = document.createElement('img');
			flx.src = img.src;
			flx.style.filter = 'flipv progid:DXImageTransform.Microsoft.Alpha(' +
			                   'opacity=50, style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy=' +
							   (img.height * .25) + ')';
		}
		/* ---- insert Reflexion ---- */
		flx.style.position = 'absolute';
		flx.style.left     = '-1000px';
		cont.appendChild(flx);
		return flx;
	}
	/* //////////// ==== ImageFlow Constructor ==== //////////// */
	function ImageFlow(oCont, size, zoom, border) {
		this.diapos     = [];  //图片序列
		this.scr        = false;  
		this.size       = size;  
		this.zoom       = zoom;
		this.bdw        = border;
		this.oCont      = oCont;  //id
		this.oc         = document.getElementById(oCont);  //object
		this.scrollbar  = getElementsByClass(this.oc,   'div', 'scrollbar');
		this.text       = getElementsByClass(this.oc,   'div', 'text');
		this.title      = getElementsByClass(this.text, 'div', 'title');
		this.legend     = getElementsByClass(this.text, 'div', 'legend');
		this.bar        = getElementsByClass(this.oc,   'img', 'bar');
		this.arL        = getElementsByClass(this.oc,   'img', 'arrow-left');
		this.arR        = getElementsByClass(this.oc,   'img', 'arrow-right');
		this.bw         = this.bar.width; 
		this.alw        = this.arL.width ;
		this.arw        = this.arR.width ;
		this.bar.parent = this.oc.parent  = this;
		this.arL.parent = this.arR.parent = this;
		this.view       = this.back       = -1;
		this.resize();
		this.oc.onselectstart = function () { return false; }

		/* ---- create images ---- */
        //创建图片序列，从hompage的a标签里的rel获取图片的src
		var img = getElementsByClass(this.oc, 'div', 'bank').getElementsByTagName('a'); 
		this.NF = img.length;
		for (var i = 0, o; o = img[i]; i++) {
			this.diapos[i] = new Diapo( this,
                                        i,
										o.rel,
										o.title || '- ' + i + ' -',
										o.innerHTML || o.rel,
										o.href || '',
										o.target || '_self'
			);
		}

		/*  ==== add mouse wheel events ==== 
            没有给火狐浏览器提供支持
            “mousewheel” 事件中“event.wheelDelta”属性值：返回的值，如果是正值说明滚轮是向上滚动，负值说明滚轮是向下滚动；
            返回的值均为120 的倍数，即：幅度大小 = 返回的值 / 120。
        */
		if (window.addEventListener)
			this.oc.addEventListener('mousewheel', function(e) {this.parent.scroll(event.wheelDelta);} , false);
        
		/*	
        //当鼠标按下的时候
		this.bar.onmousedown = function (e) {
			if (!e) e = window.event; //防止e为空
            var scl = e.screenX - this.offsetLeft; //鼠标点下时距离显示屏x轴的距离-bar相对于scroll的距离
			var self = this.parent;  //接下来的计算需要大量的用到ImageFlow对象，this.parent指向的就是ImageFlow这个对象
			
            //移动bar
			this.parent.oc.onmousemove = function (e) {
				if (!e) e = window.event;
                var a = self.ws - self.bw; // 可以拖动的最大长度 782-16=772
                var b = self.offsetLeft; // [0,772]
				self.bar.style.left = Math.round(Math.min( a , b )) + 'px'; //给bar赋值，移动
				self.view = Math.round(((e.screenX - scl) ) / (self.ws - self.bw) * self.NF); //计算view，以便移动图片
				if (self.view != self.back) self.calc(); //移动图片
				return false;
			}
        
			
			this.parent.oc.onmouseup = function (e) {
				self.oc.onmousemove = null;
				return false;
			}
			return false;
        }
		*/
	}

	/* //////////// ==== ImageFlow prototype ==== //////////// */
	ImageFlow.prototype = {
		/* ==== targets ==== */
		calc : function (inc) {
			if (inc) this.view += inc;
			var tw = 0;
			var lw = 0;
			var o = this.diapos[this.view];
			if (o && o.loaded) {
				/* ---- reset ---- */
				var ob = this.diapos[this.back];
				if (ob && ob != o) {
					ob.img.className = 'diapo';
					ob.z1 = 1;
				}
				/* ---- update legend and title---- */
                //直接新建一个text节点并替换原来的节点
				this.title.replaceChild(document.createTextNode(o.title), this.title.firstChild);
				this.legend.replaceChild(document.createTextNode(o.text), this.legend.firstChild);
				/* ---- update hyperlink ---- */
				if (o.url) {
					o.img.className = 'diapo link';
					window.status = 'hyperlink: ' + o.url;
				} else {
					o.img.className = 'diapo';
					window.status = '';
				}
				/* ---- calculate target sizes & positions ---- */
				o.w1 = Math.min(o.iw, this.wh * .5) * o.z1;
				var x0 = o.x1 = (this.wh * .5) - (o.w1 * .5);
				var x = x0 + o.w1 + this.bdw;
				for (var i = this.view + 1, o; o = this.diapos[i]; i++) {
					if (o.loaded) {
						o.x1 = x;
						o.w1 = (this.ht / o.r) * this.size;
						x   += o.w1 + this.bdw;
						tw  += o.w1 + this.bdw;
					}
				}
				x = x0 - this.bdw;
				for (var i = this.view - 1, o; o = this.diapos[i]; i--) {
					if (o.loaded) {
						o.w1 = (this.ht / o.r) * this.size;
						o.x1 = x - o.w1;
						x   -= o.w1 + this.bdw;
						tw  += o.w1 + this.bdw;
						lw  += o.w1 + this.bdw;
					}
				}
				/* 
                //当图片变为另一个的时候，对应的bar的位置也相应改变
				if (!this.scr && tw) {
					var r = (this.ws - this.alw - this.arw - this.bw) / tw;
					this.bar.style.left = Math.round( lw * r) + 'px';
				}
				*/
				
				/* ---- save preview view ---- */
				this.back = this.view;
			}
		},
		/* ==== mousewheel scrolling ==== */
        //滑轮向上滚动一下时，向后移动一个图片，滑轮向下移动一下时，向前移动一个图片
        //event.wheelDelta的值传入，判断向前还是向后
		scroll : function (sc) {
			if (sc < 0) {
				if (this.view < this.NF - 1) this.calc(1);
			} else {
				if (this.view > 0) this.calc(-1);
			}
		},
		/* ==== resize  ==== */
		resize : function () {
			this.wh = this.oc.clientWidth; // 获取对象可见内容的宽度
			this.ht = this.oc.clientHeight; // 获取对象可见内容的高度
			this.ws = this.scrollbar.offsetWidth; //返回scrollbar的宽度（包括元素宽度、内边距和边框，不包括外边距)
			this.calc();
			this.run(true);
		},
		/* ==== move all images  ==== */
		run : function (res) {
			var i = this.NF;
			while (i--) this.diapos[i].move(res);
		}
	}
	/* //////////// ==== Diapo Constructor ==== //////////// */
	Diapo = function (parent, N, src, title, text, url, target) {
		this.parent        = parent;
		this.loaded        = false;
		this.title         = title;
		this.text          = text;
		this.url           = url;
		this.target        = target;
		this.N             = N;
		this.img           = document.createElement('img');
		this.img.src       = src;
		this.img.parent    = this;
		this.img.className = 'diapo';
		this.x0            = this.parent.oc.clientWidth;
		this.x1            = this.x0;
		this.w0            = 0;
		this.w1            = 0;
		this.z1            = 1;
		this.img.parent    = this;
		this.img.onclick   = function() { this.parent.click(); }
		this.parent.oc.appendChild(this.img);
		/* ---- display external link ---- */
		if (url) {
			this.img.onmouseover = function () { this.className = 'diapo link';	}
			this.img.onmouseout  = function () { this.className = 'diapo'; }
		}
	}
	/* //////////// ==== Diapo prototype ==== //////////// */
	Diapo.prototype = {
		/* ==== HTML rendering ==== */
		move : function (res) {
			if (this.loaded) {
				var sx = this.x1 - this.x0;
				var sw = this.w1 - this.w0;
				if (Math.abs(sx) > 2 || Math.abs(sw) > 2 || res) {
					/* ---- paint only when moving ---- */
					this.x0 += sx * .1;
					this.w0 += sw * .1;
					if (this.x0 < this.parent.wh && this.x0 + this.w0 > 0) {
						/* ---- paint only visible images ---- */
						this.visible = true;
						var o = this.img.style;
						var h = this.w0 * this.r;
						/* ---- diapo ---- */
						o.left   = Math.round(this.x0) + 'px';
						o.bottom = Math.floor(this.parent.ht * .25) + 'px';
						o.width  = Math.round(this.w0) + 'px';
						o.height = Math.round(h) + 'px';
						/* ---- reflexion ---- */
						if (this.flx) {
							var o = this.flx.style;
							o.left   = Math.round(this.x0) + 'px';
							o.top    = Math.ceil(this.parent.ht * .75 + 1) + 'px';
							o.width  = Math.round(this.w0) + 'px';
							o.height = Math.round(h) + 'px';
						}
					} else {
						/* ---- disable invisible images ---- */
						if (this.visible) {
							this.visible = false;
							this.img.style.width = '0px';
							if (this.flx) this.flx.style.width = '0px';
						}
					}
				}
			} else {
				/* ==== image onload ==== */
				if (this.img.complete && this.img.width) {
					/* ---- get size image ---- */
					this.iw     = this.img.width*1.5;
					this.ih     = this.img.height*1.5;
					this.r      = this.ih / this.iw;
					this.loaded = true;
					/* ---- create reflexion ---- */
					this.flx    = createReflexion(this.parent.oc, this.img);
					if (this.parent.view < 0) this.parent.view = this.N;
					this.parent.calc();
				}
			}
		},
		/* ==== diapo onclick ==== */
		click : function () {
			if (this.parent.view == this.N) {
				/* ---- click on zoomed diapo ---- */
				if (this.url) {
					/* ---- open hyperlink ---- */
					window.open(this.url, this.target);
				} else {
					/* ---- zoom in/out ---- */
					this.z1 = this.z1 == 1 ? this.parent.zoom : 1;
					this.parent.calc();
				}
			} else {
				/* ---- select diapo ---- */
				this.parent.view = this.N;
				this.parent.calc();
			}
			return false;
		}
	}
	/* //////////// ==== public methods ==== //////////// */
	return {
		/* ==== initialize script ==== */
		create : function (div, size, zoom, border) {
			/* ---- instanciate imageFlow ---- */
			var load = function () {
				var loaded = false;
				var i = instances.length;
				while (i--) if (instances[i].oCont == div) loaded = true;
				if (!loaded) {
					/* ---- push new imageFlow instance ---- */
					instances.push(
						new ImageFlow(div, size, zoom, border)
					);
					/* ---- init script (once) ---- */
					if (!imf.initialized) {
						imf.initialized = true;
						/* ---- window resize event ---- */
						addEvent(window, 'resize', function () {
							var i = instances.length;
							while (i--) instances[i].resize();
						});
						/* ---- stop drag N drop ---- */
						addEvent(document.getElementById(div), 'mouseout', function (e) {
							if (!e) e = window.event;
							var tg = e.relatedTarget || e.toElement;
							if (tg && tg.tagName == 'HTML') {
								var i = instances.length;
								while (i--) instances[i].oc.onmousemove = null;
							}
							return false;
						});
						/* ---- set interval loop ---- */
						setInterval(function () {
							var i = instances.length;
							while (i--) instances[i].run();
						}, 16);
					}
				}
			}
			/* ---- window onload event ---- */
			addEvent(window, 'load', function () { load(); });
		}
	}
}();

/* ==== create imageFlow ==== */
//          div ID, size, zoom, border
imf.create("imageFlow", 0.15, 1.5, 10);


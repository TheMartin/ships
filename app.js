!function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=23)}([function(t,e,n){"use strict";function i(t,e){return t.x*e.x+t.y*e.y}function o(t){return i(t,t)}function r(t){return Math.sqrt(o(t))}function s(t,e,n){return(1-n)*t+n*e}var a=function(){function t(t,e){this.x=t,this.y=e}return t.prototype.clone=function(){return new t(this.x,this.y)},t.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},t.prototype.subtract=function(t){return this.x-=t.x,this.y-=t.y,this},t.prototype.multiply=function(t){return this.x*=t,this.y*=t,this},t.prototype.elementMultiply=function(t){return this.x*=t.x,this.y*=t.y,this},t.prototype.elementDivide=function(t){return this.x/=t.x,this.y/=t.y,this},t.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},t.prototype.normalize=function(){return this.multiply(1/r(this))},t.prototype.normalized=function(){return this.clone().normalize()},t.prototype.rotate=function(t){var e=Math.cos(t),n=Math.sin(t),i=e*this.x-n*this.y,o=n*this.x+e*this.y;return this.x=i,this.y=o,this},t.prototype.rotated=function(t){return this.clone().rotate(t)},t.prototype.angle=function(){return Math.atan2(this.x,-this.y)},t.lerp=function(t,e,n){return t.clone().multiply(1-n).add(e.clone().multiply(n))},t.random=function(){return new t(Math.random(),Math.random())},t.zero=new t(0,0),t}();e.Vec2=a,e.dot=i,e.norm2=o,e.norm=r,e.lerp=s},function(t,e,n){"use strict";var i=function(){function t(t){this.pos=t}return t.t="Position",t}();e.Position=i;var o=function(){function t(t){this.angle=t}return t.t="Rotation",t}();e.Rotation=o},function(t,e,n){"use strict";var i=function(){function t(){}return t.t="Cached",t}();e.Cached=i},function(t,e,n){"use strict";var i=n(1),o=n(0),r=function(){function t(){}return t.t="MoveToTarget",t}();e.MoveToTarget=r;var s=function(){function t(t,e){this.entities=t,this.speed=e}return t.prototype.update=function(t){var e=this;this.entities.forEachEntity([i.Position.t,i.Rotation.t,r.t],function(n,i){var r=i,s=r[0],a=r[1],c=r[2];if(c.target){var h=c.target.clone().subtract(s.pos);o.norm2(h)>.5?(a.angle=h.angle(),s.pos.add(h.normalized().multiply(Math.min(o.norm(h),e.speed*t)))):c.target=null}})},t}();e.MoveTo=s},function(t,e,n){"use strict";function i(t,e,n){var i=t.pos;return e&&e.value&&(i=a.Vec2.lerp(e.value.pos,i,n)),i}function o(t,e,n){var i=t.angle;return e&&e.value&&(i=a.lerp(e.value.angle,i,n)),i}var r=n(1),s=n(2),a=n(0),c=function(){function t(t){this.entities=t}return t.prototype.update=function(t){this.entities.forEachEntity([r.Position.t,s.Cached.t+r.Position.t],function(t,e){var n=e,i=n[0];n[1].value=new r.Position(i.pos.clone())})},t}();e.CachePosition=c,e.interpolatePosition=i;var h=function(){function t(t){this.entities=t}return t.prototype.update=function(t){this.entities.forEachEntity([r.Rotation.t,s.Cached.t+r.Rotation.t],function(t,e){var n=e,i=n[0];n[1].value=new r.Rotation(i.angle)})},t}();e.CacheRotation=h,e.interpolateRotation=o},function(t,e,n){"use strict";!function(t){t[t.Local=0]="Local",t[t.Ai=1]="Ai",t[t.Remote=2]="Remote"}(e.PlayerType||(e.PlayerType={}));var i=(e.PlayerType,function(){function t(t){this.type=t}return t}());e.Player=i;var o=function(){function t(t){this.player=t}return t.t="Controlled",t}();e.Controlled=o},function(t,e,n){"use strict";function i(t,e){return t.x>=e.min.x&&t.x<=e.max.x&&t.y>=e.min.y&&t.y<=e.max.y}function o(t){return void 0!==t.box}var r=n(2),s=n(1),a=n(5),c=n(4),h=n(0),u=function(){function t(){}return t.t="Selectable",t}();e.Selectable=u;var l=function(){function t(){}return t.t="Selected",t}();e.Selected=l;var p=function(){function t(t,e){this.min=new h.Vec2(Math.min(t.x,e.x),Math.min(t.y,e.y)),this.max=new h.Vec2(Math.max(t.x,e.x),Math.max(t.y,e.y))}return t}(),d=function(){function t(t){this.box=t}return t}(),f=function(){function t(){}return t}(),y=function(){function t(t,e,n,i,o){var r=this;this.entities=t,this.player=e,this.renderer=i,this.viewport=o,n.addEventListener("mousedown",function(t){var e=t;0==e.button&&(r.dragStart=new h.Vec2(e.clientX,e.clientY))}),n.addEventListener("mousemove",function(t){var e=t;0!=(1&e.buttons)&&(r.dragCurrent=new h.Vec2(e.clientX,e.clientY))}),n.addEventListener("mouseup",function(t){0==t.button&&(r.dragCurrent?r.selection=new d(new p(r.dragStart,r.dragCurrent)):r.selection=new f,r.dragStart=null,r.dragCurrent=null)})}return t.prototype.update=function(e,n){var p=this;this.selection&&(o(this.selection)?this.entities.forEachEntity([s.Position.t,u.t,a.Controlled.t],function(t,e){var o=e,a=o[0];if(o[2].player===p.player){var h=t.getOptionalComponents([r.Cached.t+s.Position.t,l.t]),u=h[0],d=h[1],f=i(p.viewport.transform(c.interpolatePosition(a,u,n)),p.selection.box);!d&&f?t.addComponent(l.t,new l):d&&!f&&t.removeComponent(l.t)}}):this.entities.forEachEntity([],function(t,e){t.removeComponent(l.t)}),this.selection=null),this.entities.forEachEntity([l.t,s.Position.t],function(e,i){var o=i,a=o[1],u=p.viewport.transform(c.interpolatePosition(a,e.components[r.Cached.t+s.Position.t],n)),l=new h.Vec2(10,10).multiply(p.viewport.scale);p.renderer.drawRect(u.clone().subtract(l),u.clone().add(l),t.selectedBoxProps)}),this.dragStart&&this.dragCurrent&&this.renderer.drawRect(this.dragStart,this.dragCurrent,t.selectionBoxProps)},t.selectedBoxProps={stroke:"rgb(0, 255, 0)"},t.selectionBoxProps={stroke:"rgb(0, 255, 0)",lineWidth:1,fillColor:"rgba(0, 255, 0, 0.2)"},t}();e.SelectionSystem=y},function(t,e,n){"use strict";var i=n(0),o=function(){function t(t,e,n){this.pos=t,this.rot=e,this.scale=n}return t.prototype.transform=function(t){return t.rotated(this.rot).multiply(this.scale).add(this.pos)},t.prototype.inverseTransform=function(t){return t.clone().subtract(this.pos).multiply(1/this.scale).rotate(-this.rot)},t.identity=new t(i.Vec2.zero,0,1),t}();e.Viewport=o;var r=function(){function t(t){this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.ctx.lineJoin="round",this.ctx.lineCap="round"}return t.prototype.drawShape=function(t,e,n,i,r){void 0===r&&(r=o.identity),this.setTransform(r.transform(e),n+r.rot,i*r.scale),this.setProps(t.props),this.ctx.beginPath(),this.ctx.moveTo(t.vertices[0].x,t.vertices[0].y);for(var s=1;s<t.vertices.length;++s)this.ctx.lineTo(t.vertices[s].x,t.vertices[s].y);this.ctx.closePath(),this.render(t.props)},t.prototype.drawLine=function(t,e,n,i){void 0===n&&(n={}),void 0===i&&(i=o.identity),this.setViewport(i),this.setProps(n);var r=[];n.lineDash&&(r=this.ctx.getLineDash(),this.ctx.setLineDash(n.lineDash)),this.ctx.beginPath(),this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(e.x,e.y),this.render(n),n.lineDash&&this.ctx.setLineDash(r)},t.prototype.drawRect=function(t,e,n,i){void 0===n&&(n={}),void 0===i&&(i=o.identity),this.setViewport(i),this.setProps(n);var r=Math.min(t.x,e.x),s=Math.min(t.y,e.y),a=Math.abs(e.x-t.x),c=Math.abs(e.y-t.y);n.fillColor&&this.ctx.fillRect(r,s,a,c),n.stroke&&this.ctx.strokeRect(r,s,a,c)},t.prototype.drawCircle=function(t,e,n,i){void 0===n&&(n={}),void 0===i&&(i=o.identity),this.setViewport(i),this.setProps(n),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,e,0,2*Math.PI),this.ctx.closePath(),this.render(n)},t.prototype.clear=function(){this.setIdentityTransform(),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},t.prototype.setProps=function(t){t.fillColor&&(this.ctx.fillStyle=t.fillColor),t.stroke&&(this.ctx.strokeStyle=t.stroke,t.lineWidth&&(this.ctx.lineWidth=t.lineWidth))},t.prototype.render=function(t){t.fillColor&&this.ctx.fill(),t.stroke&&this.ctx.stroke()},t.prototype.setViewport=function(t){t==o.identity?this.setIdentityTransform():this.setTransform(t.pos,t.rot,t.scale)},t.prototype.setIdentityTransform=function(){this.ctx.setTransform(1,0,0,1,0,0)},t.prototype.setTransform=function(t,e,n){var i=n*Math.cos(e),o=n*Math.sin(e);this.ctx.setTransform(i,o,-o,i,t.x,t.y)},t}();e.Renderer=r},function(t,e,n){"use strict";var i=function(){function t(){this.components={},this.id=t.Count,t.Count+=1}return t.prototype.addComponent=function(t,e){return this.components[t]=e,this},t.prototype.removeComponent=function(t){return delete this.components[t],this},t.prototype.getComponents=function(t){for(var e=[],n=0,i=t;n<i.length;n++){var o=i[n];if(!this.components[o])return null;e.push(this.components[o])}return e},t.prototype.getOptionalComponents=function(t){for(var e=[],n=0,i=t;n<i.length;n++){var o=i[n];this.components[o]&&e.push(this.components[o])}return e},t.Count=0,t}();e.Entity=i;var o=function(){function t(){this.entities={}}return t.prototype.addEntity=function(t){this.entities[t.id]=t},t.prototype.removeEntity=function(t){delete this.entities[t.id]},t.prototype.forEachEntity=function(t,e){for(var n in this.entities){var i=this.entities[n],o=i.getComponents(t);o&&e(i,o)}},t}();e.EntityContainer=o},function(t,e,n){"use strict";var i=function(){function t(t){this.name=t}return t.t="Named",t}();e.Named=i},function(t,e,n){"use strict";var i=n(1),o=n(2),r=n(4),s=function(){function t(t){this.shape=t}return t.t="RenderShape",t}();e.RenderShape=s;var a=function(){function t(t,e,n){this.entities=t,this.renderer=e,this.viewport=n}return t.prototype.update=function(t,e){var n=this;this.entities.forEachEntity([s.t,i.Position.t],function(t,s){var a=s,c=a[0],h=a[1],u=t.getOptionalComponents([i.Rotation.t,o.Cached.t+i.Position.t,o.Cached.t+i.Rotation.t]),l=u[0],p=u[1],d=u[2];n.renderer.drawShape(c.shape,r.interpolatePosition(h,p,e),l?r.interpolateRotation(l,d,e):0,1,n.viewport)})},t}();e.ShapeRenderer=a},function(t,e,n){"use strict";var i=n(8),o=n(4),r=n(3),s=n(17),a=n(18),c=n(16),h=n(6),u=n(10),l=n(19),p=n(20),d=n(5),f=n(7),y=n(0),v=n(14),m=n(21),w=function(){function t(t,e){this.ui=t,this.renderer=e,this.lastUpdate=0,this.lastDraw=0,this.fps=0,this.entityContainer=new i.EntityContainer,this.updateSystems=[],this.renderSystems=[],this.viewport=f.Viewport.identity,this.players=[];var n=new d.Player(d.PlayerType.Local),v=new d.Player(d.PlayerType.Ai);this.players=[n,v],this.updateSystems=[new o.CachePosition(this.entityContainer),new o.CacheRotation(this.entityContainer),new s.ChooseRandomTarget(this.entityContainer,v,new y.Vec2(0,0),new y.Vec2(1e3,1e3)),new r.MoveTo(this.entityContainer,50)],this.viewport=new f.Viewport(new y.Vec2(0,0),0,1),this.renderSystems=[new p.ViewportController(t,1e3,this.viewport),new h.SelectionSystem(this.entityContainer,n,t,e,this.viewport),new c.OrderMove(this.entityContainer,n,t,this.viewport),new a.RenderMoveTarget(this.entityContainer,e,this.viewport),new u.ShapeRenderer(this.entityContainer,e,this.viewport),new l.StatusWindow(this.entityContainer,t)]}return t.prototype.start=function(t){var e=this;this.fps=t,this.lastUpdate=performance.now(),this.lastDraw=performance.now();for(var n=function(){var t=performance.now(),i=(t-e.lastUpdate)/1e3;e.lastUpdate=t,e.update(i),setTimeout(n,1e3/e.fps)},i=function(t){var n=(t-e.lastDraw)/1e3;e.lastDraw=t;var o=e.fps*(t-e.lastUpdate)/1e3;e.draw(n,o),requestAnimationFrame(i)},o=new y.Vec2(50,50),r=new y.Vec2(600,600),s=m.shuffle(["Arethusa","Aurora","Galatea","Penelope","Phaeton","Bonaventure","Dido","Argonaut","Scylla","Swiftsure","Minotaur","Bellerophon","Vanguard","Collosus","Audacious","Warspite","Valiant"]),a=0;a<5;++a)this.entityContainer.addEntity(v.Static.makeShip(y.Vec2.random().elementMultiply(r).add(o),0,s[a],v.Static.Ship,this.players[0]));for(var a=5;a<10;++a)this.entityContainer.addEntity(v.Static.makeShip(y.Vec2.random().elementMultiply(r).add(o),0,s[a],v.Static.NeutralShip,this.players[1]));setTimeout(n,1e3/this.fps),requestAnimationFrame(i)},t.prototype.update=function(t){for(var e=0,n=this.updateSystems;e<n.length;e++){n[e].update(t)}},t.prototype.draw=function(t,e){this.renderer.clear();for(var n=0,i=this.renderSystems;n<i.length;n++){i[n].update(t,e)}},t}();e.Game=w},function(t,e,n){"use strict";var i=function(){function t(t,e){this.rootElement=t,this.canvas=e}return t.prototype.addEventListener=function(t,e){this.rootElement.addEventListener(t,e)},t.prototype.removeEventListener=function(t,e){this.rootElement.removeEventListener(t,e)},t.prototype.addElement=function(t){this.rootElement.appendChild(t)},t.prototype.removeElement=function(t){this.rootElement.removeChild(t)},t.prototype.canvasWidth=function(){return this.canvas.width},t.prototype.canvasHeight=function(){return this.canvas.height},t}();e.UiManager=i},function(t,e){},function(t,e,n){"use strict";var i=n(8),o=n(2),r=n(1),s=n(10),a=n(3),c=n(6),h=n(9),u=n(5),l=n(15),p=n(0),d=function(){function t(){}return t.makeShip=function(t,e,n,l,p){return(new i.Entity).addComponent(r.Position.t,new r.Position(t)).addComponent(r.Rotation.t,new r.Rotation(e)).addComponent(s.RenderShape.t,new s.RenderShape(l)).addComponent(o.Cached.t+r.Position.t,new o.Cached).addComponent(o.Cached.t+r.Rotation.t,new o.Cached).addComponent(a.MoveToTarget.t,new a.MoveToTarget).addComponent(c.Selectable.t,new c.Selectable).addComponent(h.Named.t,new h.Named(n)).addComponent(u.Controlled.t,new u.Controlled(p))},t.Box=new l.Shape({stroke:"black",lineWidth:5,fillColor:"gray"},[new p.Vec2(-35,-35),new p.Vec2(-25,25),new p.Vec2(25,25),new p.Vec2(25,-25)]),t.shipVertices=[new p.Vec2(0,-15),new p.Vec2(-12,15),new p.Vec2(0,10.5),new p.Vec2(12,15)],t.Ship=new l.Shape({stroke:"hsla(207, 100%, 60%, 1)",lineWidth:3,fillColor:"hsla(207, 100%, 30%, 0.8)"},t.shipVertices),t.NeutralShip=new l.Shape({stroke:"hsla(120, 100%, 60%, 1)",lineWidth:3,fillColor:"hsla(120, 100%, 30%, 0.8)"},t.shipVertices),t}();e.Static=d},function(t,e,n){"use strict";var i=function(){function t(t,e){this.props=t,this.vertices=e}return t}();e.Shape=i},function(t,e,n){"use strict";var i=n(3),o=n(6),r=n(5),s=n(0),a=function(){function t(t,e,n,a){var c=this;this.entities=t,this.player=e,n.addEventListener("mouseup",function(t){var e=t;2==e.button&&c.entities.forEachEntity([o.Selected.t,i.MoveToTarget.t,r.Controlled.t],function(t,n){var i=n,o=i[1];i[2].player===c.player&&(o.target=a.inverseTransform(new s.Vec2(e.clientX,e.clientY)))}),t.preventDefault()})}return t.prototype.update=function(t,e){},t}();e.OrderMove=a},function(t,e,n){"use strict";var i=n(3),o=n(5),r=n(0),s=function(){function t(t,e,n,i){this.entities=t,this.player=e,this.min=n,this.size=i.clone().subtract(n)}return t.prototype.update=function(t){var e=this;this.entities.forEachEntity([i.MoveToTarget.t,o.Controlled.t],function(t,n){var i=n,o=i[0];i[1].player!==e.player||o.target||(o.target=e.min.clone().add(new r.Vec2(Math.random(),Math.random()).elementMultiply(e.size)))})},t}();e.ChooseRandomTarget=s},function(t,e,n){"use strict";var i=n(3),o=n(6),r=n(1),s=n(2),a=n(4),c=function(){function t(t,e,n){this.entities=t,this.renderer=e,this.viewport=n}return t.prototype.update=function(e,n){var c=this;this.entities.forEachEntity([o.Selected.t,i.MoveToTarget.t],function(e,i){var o=i,h=o[1];if(h.target){c.renderer.drawCircle(h.target,10,t.targetProps,c.viewport),c.renderer.drawCircle(h.target,5,t.targetProps,c.viewport);var u=e.getOptionalComponents([r.Position.t,s.Cached.t+r.Position.t]),l=u[0],p=u[1];l&&c.renderer.drawLine(a.interpolatePosition(l,p,n),h.target,t.targetProps,c.viewport)}})},t.targetProps={stroke:"rgb(0, 255, 0)",lineWidth:1,lineDash:[5,15]},t}();e.RenderMoveTarget=c},function(t,e,n){"use strict";function i(t){return t.x.toFixed()+" : "+t.y.toFixed()}var o=n(6),r=n(2),s=n(1),a=n(4),c=n(3),h=n(9),u=n(22),l=function(){function t(t,e){this.entities=t,this.ui=e,this.elem=u.VdomElement.create("div",{class:"window"},[]),this.$elem=u.createElement(this.elem)}return t.prototype.update=function(t,e){var n=u.VdomElement.create("div",{class:"window"},[]);this.entities.forEachEntity([o.Selected.t],function(t,o){var l=t.getOptionalComponents([h.Named.t,s.Position.t,r.Cached.t+s.Position.t,c.MoveToTarget.t]),p=l[0],d=l[1],f=l[2],y=l[3],v=[];p&&v.push(u.VdomElement.create("span",{class:"name"},[p.name])),d&&v.push(u.VdomElement.create("span",{class:"pos"},[i(a.interpolatePosition(d,f,e))])),y&&y.target&&v.push(u.VdomElement.create("span",{class:"tgt"},[i(y.target)])),n.children.push(u.VdomElement.create("div",{class:"ship"},v))}),u.updateElementChildren(this.$elem,n,this.elem),this.elem=n,0==this.elem.children.length?this.$elem.parentNode&&this.ui.removeElement(this.$elem):this.$elem.parentNode||this.ui.addElement(this.$elem)},t}();e.StatusWindow=l},function(t,e,n){"use strict";var i=n(0),o=function(){function t(t,e,n){var o=this;this.scrollSpeed=e,this.viewport=n,this.lastMousePos=new i.Vec2(0,0),this.screenMove=new i.Vec2(0,0),this.screenScroll=new i.Vec2(0,0),t.addEventListener("mousemove",function(e){if(o.screenScroll.x=o.screenScroll.y=0,0!=(2&e.buttons))o.screenMove.add(new i.Vec2(e.clientX,e.clientY).subtract(o.lastMousePos));else{var n=e.clientX/t.canvasWidth(),r=e.clientY/t.canvasHeight();n<.1?o.screenScroll.x=Math.pow(i.lerp(1,0,n/.1),2):n>.9&&(o.screenScroll.x=-Math.pow(i.lerp(0,1,(n-.9)/.1),2)),r<.1?o.screenScroll.y=Math.pow(i.lerp(1,0,r/.1),2):r>.9&&(o.screenScroll.y=-Math.pow(i.lerp(0,1,(r-.9)/.1),2))}o.lastMousePos.x=e.clientX,o.lastMousePos.y=e.clientY})}return t.prototype.update=function(t,e){this.viewport.pos.add(this.screenScroll.clone().multiply(this.scrollSpeed*t)),this.viewport.pos.add(this.screenMove),this.screenMove.x=this.screenMove.y=0},t}();e.ViewportController=o},function(t,e,n){"use strict";function i(t){for(var e=t.length-1;e>0;--e){var n=Math.floor(Math.random()*(e+1)),i=t[e];t[e]=t[n],t[n]=i}return t}e.shuffle=i},function(t,e,n){"use strict";function i(t,e,n){t.setAttribute(e,n)}function o(t,e){Object.keys(e).forEach(function(n){return i(t,n,e[n])})}function r(t){return void 0!==t.type}function s(t){if("string"==typeof t)return document.createTextNode(t);var e=document.createElement(t.type);return o(e,t.props),t.children.map(s).forEach(function(t){return e.appendChild(t)}),e}function a(t,e){return typeof t!=typeof e||"string"==typeof t&&t!==e||t.type!==e.type}function c(t,e,n){for(var i=0;i<Math.min(e.children.length,n.children.length);++i)a(e.children[i],n.children[i])?t.replaceChild(s(e.children[i]),t.childNodes[i]):r(e.children[i])&&c(t.childNodes[i],e.children[i],n.children[i]);if(n.children.length>e.children.length)for(var i=n.children.length-1;i>=e.children.length;--i)t.removeChild(t.childNodes[i]);else if(e.children.length>n.children.length)for(var i=n.children.length;i<e.children.length;++i)t.appendChild(s(e.children[i]))}var h=function(){function t(t,e,n){this.type=t,this.props=e,this.children=n}return t.create=function(t,e,n){return{type:t,props:e,children:n}},t}();e.VdomElement=h,e.createElement=s,e.updateElementChildren=c},function(t,e,n){"use strict";var i=n(11),o=n(7),r=n(12);n(13);var s=document.getElementById("content"),a=document.createElement("canvas");s.addEventListener("contextmenu",function(t){t.preventDefault()});var c=function(){a.width=window.innerWidth,a.height=window.innerHeight};c(),window.addEventListener("resize",c),s.appendChild(a);var h=new o.Renderer(a),u=new r.UiManager(s,a);new i.Game(u,h).start(60)}]);
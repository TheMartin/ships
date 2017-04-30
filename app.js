!function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=40)}([function(t,e,n){"use strict";var i=function(){function t(t){this.pos=t}return t.t="Position",t}();e.Position=i;var o=function(){function t(t){this.angle=t}return t.t="Rotation",t}();e.Rotation=o},function(t,e,n){"use strict";function i(t,e){return t.x*e.x+t.y*e.y}function o(t,e){return t.x*e.y-t.y*e.x}function r(t){return i(t,t)}function s(t){return Math.sqrt(r(t))}function a(t,e){return r(t.clone().subtract(e))}function c(t,e){return Math.sqrt(a(t,e))}function u(t,e,n){return(1-n)*t+n*e}var l=function(){function t(t,e){this.x=t,this.y=e}return t.prototype.clone=function(){return new t(this.x,this.y)},t.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},t.prototype.subtract=function(t){return this.x-=t.x,this.y-=t.y,this},t.prototype.multiply=function(t){return this.x*=t,this.y*=t,this},t.prototype.elementMultiply=function(t){return this.x*=t.x,this.y*=t.y,this},t.prototype.elementDivide=function(t){return this.x/=t.x,this.y/=t.y,this},t.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},t.prototype.normalize=function(){return this.multiply(1/s(this))},t.prototype.normalized=function(){return this.clone().normalize()},t.prototype.rotate=function(t){var e=Math.cos(t),n=Math.sin(t),i=e*this.x-n*this.y,o=n*this.x+e*this.y;return this.x=i,this.y=o,this},t.prototype.rotated=function(t){return this.clone().rotate(t)},t.prototype.angle=function(){return Math.atan2(this.x,-this.y)},t.lerp=function(t,e,n){return t.clone().multiply(1-n).add(e.clone().multiply(n))},t.random=function(){return new t(Math.random(),Math.random())},t.fromAngle=function(e){return new t(Math.sin(e),-Math.cos(e))},t.zero=new t(0,0),t}();e.Vec2=l,e.dot=i,e.cross=o,e.norm2=r,e.norm=s,e.distance2=a,e.distance=c,e.lerp=u},function(t,e,n){"use strict";var i=function(){function t(){}return t.t="Cached",t}();e.Cached=i},function(t,e,n){"use strict";function i(t,e,n){var i=t.pos;return e&&e.value&&(i=a.Vec2.lerp(e.value.pos,i,n)),i}function o(t,e,n){var i=t.angle;return e&&e.value&&(i=a.lerp(e.value.angle,i,n)),i}var r=n(0),s=n(2),a=n(1),c=function(){function t(t){this.entities=t}return t.prototype.update=function(t,e){this.entities.forEachEntity([r.Position.t,s.Cached.t+r.Position.t],function(t,e){var n=e,i=n[0];n[1].value=new r.Position(i.pos.clone())})},t}();e.CachePosition=c,e.interpolatePosition=i;var u=function(){function t(t){this.entities=t}return t.prototype.update=function(t,e){this.entities.forEachEntity([r.Rotation.t,s.Cached.t+r.Rotation.t],function(t,e){var n=e,i=n[0];n[1].value=new r.Rotation(i.angle)})},t}();e.CacheRotation=u,e.interpolateRotation=o},function(t,e,n){"use strict";function i(t,e){return t.x>=e.min.x&&t.x<=e.max.x&&t.y>=e.min.y&&t.y<=e.max.y}function o(t){return void 0!==t.box}var r=n(10),s=n(2),a=n(0),c=n(8),u=n(3),l=n(1),h=function(){function t(){}return t.t="Selectable",t}();e.Selectable=h;var p=function(){function t(){}return t.t="Selected",t}();e.Selected=p;var d=function(){function t(t,e){this.min=new l.Vec2(Math.min(t.x,e.x),Math.min(t.y,e.y)),this.max=new l.Vec2(Math.max(t.x,e.x),Math.max(t.y,e.y))}return t}(),f=function(){function t(t){this.box=t}return t}(),v=function(){function t(){}return t}(),m=function(){function t(t,e,n,i,o){var s=this;this.entities=t,this.player=e,this.ui=n,this.renderer=i,this.viewport=o,n.addEventListener("dragstart",function(t){t.button===r.MouseButton.Left&&(s.dragStart=s.viewport.inverseTransform(t.pos))}),n.addEventListener("dragend",function(t){t.button===r.MouseButton.Left&&(s.selection=new f(new d(s.viewport.transform(s.dragStart),s.dragCurrent)),s.dragStart=null,s.dragCurrent=null)}),n.addEventListener("click",function(t){t.button===r.MouseButton.Left&&(s.selection=new v)}),n.addEventListener("entityclick",function(t){t.button===r.MouseButton.Left&&s.entities.forEachEntity([h.t,c.Controlled.t],function(e,n){var i=n;i[0];if(i[1].player===s.player){var o=e.getOptionalComponents([p.t])[0];o||e!==t.entities[0]?o&&e!==t.entities[0]&&e.removeComponent(p.t):e.addComponent(p.t,new p)}})})}return t.prototype.update=function(e,n,r){var d=this;if(this.selection&&(o(this.selection)?this.entities.forEachEntity([a.Position.t,h.t,c.Controlled.t],function(t,e){var o=e,r=o[0];if(o[2].player===d.player){var c=t.getOptionalComponents([s.Cached.t+a.Position.t,p.t]),l=c[0],h=c[1],f=i(d.viewport.transform(u.interpolatePosition(r,l,n)),d.selection.box);!h&&f?t.addComponent(p.t,new p):h&&!f&&t.removeComponent(p.t)}}):this.entities.forEachEntity([],function(t,e){t.removeComponent(p.t)}),this.selection=null),this.entities.forEachEntity([p.t,a.Position.t],function(e,i){var o=i,r=o[1],c=d.viewport.transform(u.interpolatePosition(r,e.components[s.Cached.t+a.Position.t],n)),h=new l.Vec2(10,10).multiply(d.viewport.scale);d.renderer.drawRect(c.clone().subtract(h),c.clone().add(h),t.selectedBoxProps)}),this.dragStart){this.ui.mousePosition()&&(this.dragCurrent=this.ui.mousePosition().clone()),this.dragCurrent&&this.renderer.drawRect(this.viewport.transform(this.dragStart),this.dragCurrent,t.selectionBoxProps)}},t.selectedBoxProps={stroke:"rgb(0, 255, 0)",lineWidth:3},t.selectionBoxProps={stroke:"rgb(0, 255, 0)",lineWidth:1,fillColor:"rgba(0, 255, 0, 0.2)"},t}();e.SelectionSystem=m},function(t,e,n){"use strict";var i=function(){function t(t){this.vel=t}return t.t="Velocity",t}();e.Velocity=i;var o=function(){function t(t){this.vel=t}return t.t="AngularVelocity",t}();e.AngularVelocity=o},function(t,e,n){"use strict";var i=function(){function t(){}return t.t="Targetable",t}();e.Targetable=i;var o=function(){function t(){this.target=null}return t.prototype.setTarget=function(t){return!!t.components[i.t]&&(this.target=t,!0)},t.t="AttackTarget",t}();e.AttackTarget=o},function(t,e,n){"use strict";var i=n(0),o=n(5),r=n(1),s=n(19),a=function(){function t(){}return t.t="MoveToTarget",t}();e.MoveToTarget=a;var c=function(){function t(t,e,n){this.entities=t,this.speed=e,this.angularSpeed=n}return t.prototype.update=function(t,e){var n=this;this.entities.forEachEntity([i.Position.t,i.Rotation.t,o.Velocity.t,o.AngularVelocity.t,a.t],function(t,e){var i=e,o=i[0],a=i[1],c=i[2],u=i[3],l=i[4];if(l.target){var h=l.target.clone().subtract(o.pos);r.norm(h)>.25?(c.vel=h.normalized().multiply(n.speed),u.vel=Math.sign(s.angleDiff(a.angle,h.angle()))*n.angularSpeed):l.target=null}else c.vel=r.Vec2.zero.clone(),u.vel=0})},t}();e.MoveTo=c},function(t,e,n){"use strict";!function(t){t[t.Local=0]="Local",t[t.Ai=1]="Ai",t[t.Remote=2]="Remote"}(e.PlayerType||(e.PlayerType={}));var i=(e.PlayerType,function(){function t(t){this.type=t}return t}());e.Player=i;var o=function(){function t(t){this.player=t}return t.t="Controlled",t}();e.Controlled=o},function(t,e,n){"use strict";var i=function(){function t(t){this.maxHitpoints=t,this.hitpoints=t}return t.t="Damageable",t}();e.Damageable=i;var o=function(){function t(t){this.entities=t}return t.prototype.update=function(t,e){var n=this;this.entities.forEachEntity([i.t],function(t,i){i[0].hitpoints<0&&e.push(function(){n.entities.removeEntity(t)})})},t}();e.CheckDestroyed=o},function(t,e,n){"use strict";function i(t){return t}var o=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},r=n(12),s=n(1);!function(t){t[t.Left=0]="Left",t[t.Middle=1]="Middle",t[t.Right=2]="Right",t[t.Count=3]="Count"}(e.MouseButton||(e.MouseButton={}));var a,c=e.MouseButton;!function(t){t[t.Up=0]="Up",t[t.Clicked=1]="Clicked",t[t.Dragged=2]="Dragged"}(a||(a={}));!function(t){var e=function(){function t(){}return t}();t.EntityClick=e;var n=function(){function t(){}return t}();t.MouseEvent=n;var i=function(t){function e(){t.apply(this,arguments)}return o(e,t),e}(n);t.MouseClick=i;var r=function(t){function e(){t.apply(this,arguments)}return o(e,t),e}(n);t.MouseDragStart=r;var s=function(t){function e(){t.apply(this,arguments)}return o(e,t),e}(n);t.MouseDragEnd=s;var a=function(){function t(){}return t}();t.MouseMove=a;var c=function(){function t(){}return t}();t.MouseScroll=c}(e.Events||(e.Events={}));var u=function(){function t(t,e,n){var o=this;this.entities=t,this.rootElement=e,this.canvas=n,this.mouseButtons=[a.Up,a.Up,a.Up],this.mousePos=new s.Vec2(0,0),this.listeners={entityclick:[],click:[],mousemove:[],dragstart:[],dragend:[],wheel:[]},this.mousePos=new s.Vec2(this.canvas.width/2,this.canvas.height/2),n.addEventListener("mousedown",function(t){o.mouseButtons[i(t.button)]=a.Clicked}),n.addEventListener("mouseup",function(t){var e=new s.Vec2(t.clientX,t.clientY),n=i(t.button);if(o.mouseButtons[n]===a.Clicked){var c=o.entities.filterEntities([r.Clickable.t],function(t,n){var i=n[0];return i.pos&&s.distance(i.pos,e)<i.radius});c.length>0?o.invokeListeners("entityclick",{entities:c,button:n}):o.invokeListeners("click",{pos:e,button:n})}else o.mouseButtons[n]===a.Dragged&&o.invokeListeners("dragend",{pos:e,button:n});o.mouseButtons[n]=a.Up}),n.addEventListener("wheel",function(t){o.invokeListeners("wheel",{pos:o.mousePos?o.mousePos.clone():null,delta:Math.sign(t.deltaY)})}),e.addEventListener("mouseenter",function(t){o.mousePos=new s.Vec2(t.clientX,t.clientY)}),e.addEventListener("mouseleave",function(t){o.mousePos=null}),e.addEventListener("mousemove",function(t){var e=o.mousePos.clone(),n=e.clone().subtract(new s.Vec2(t.clientX,t.clientY));o.mousePos.x=t.clientX,o.mousePos.y=t.clientY,o.invokeListeners("mousemove",{pos:o.mousePos.clone(),delta:n});for(var i=c.Left;i<c.Count;++i)o.mouseButtons[i]===a.Clicked&&(o.invokeListeners("dragstart",{pos:e,button:i}),o.mouseButtons[i]=a.Dragged)})}return t.prototype.addEventListener=function(t,e){var n=t.toLowerCase();n in this.listeners&&this.listeners[n].push(e)},t.prototype.removeEventListener=function(t,e){var n=t.toLowerCase();if(n in this.listeners){var i=this.listeners[n].indexOf(e);i>-1&&this.listeners[n].splice(i,1)}},t.prototype.addElement=function(t){this.rootElement.appendChild(t)},t.prototype.removeElement=function(t){this.rootElement.removeChild(t)},t.prototype.canvasWidth=function(){return this.canvas.width},t.prototype.canvasHeight=function(){return this.canvas.height},t.prototype.canvasDimensions=function(){return new s.Vec2(this.canvasWidth(),this.canvasHeight())},t.prototype.mousePosition=function(){return this.mousePos},t.prototype.invokeListeners=function(t,e){if(t in this.listeners)for(var n=0,i=this.listeners[t];n<i.length;n++){var o=i[n];o(e)}},t}();e.UiManager=u},function(t,e,n){"use strict";var i=function(){function t(e){void 0===e&&(e={}),this.components={},this.components=e,this.id=t.Count,t.Count+=1}return t.prototype.addComponent=function(t,e){return this.components[t]=e,this},t.prototype.removeComponent=function(t){return delete this.components[t],this},t.prototype.getComponents=function(t){for(var e=[],n=0,i=t;n<i.length;n++){var o=i[n];if(!this.components[o])return null;e.push(this.components[o])}return e},t.prototype.getOptionalComponents=function(t){for(var e=[],n=0,i=t;n<i.length;n++){var o=i[n];this.components[o]&&e.push(this.components[o])}return e},t.Count=0,t}();e.Entity=i;var o=function(){function t(){this.entities={}}return t.prototype.addEntity=function(t){this.entities[t.id]=t},t.prototype.containsEntity=function(t){return null!==t&&t.id in this.entities},t.prototype.removeEntity=function(t){delete this.entities[t.id]},t.prototype.forEachEntity=function(t,e){for(var n in this.entities){var i=this.entities[n],o=i.getComponents(t);o&&e(i,o)}},t.prototype.findEntity=function(t,e){for(var n in this.entities){var i=this.entities[n],o=i.getComponents(t);if(o&&e(i,o))return i}return null},t.prototype.filterEntities=function(t,e){var n=[];for(var i in this.entities){var o=this.entities[i],r=o.getComponents(t);r&&e(o,r)&&n.push(o)}return n},t}();e.EntityContainer=o},function(t,e,n){"use strict";var i=n(0),o=n(2),r=n(3),s=function(){function t(t){this.radius=t}return t.t="Clickable",t}();e.Clickable=s;var a=function(){function t(t,e){this.entities=t,this.viewport=e}return t.prototype.update=function(t,e,n){var a=this;this.entities.forEachEntity([s.t,i.Position.t],function(t,n){var s=n,c=s[0],u=s[1],l=t.getOptionalComponents([o.Cached.t+i.Position.t])[0];c.pos=a.viewport.transform(r.interpolatePosition(u,l,e))})},t}();e.UpdateClickable=a},function(t,e,n){"use strict";var i=n(1),o=function(){function t(t,e,n){this.pos=t,this.rot=e,this.scale=n}return t.prototype.transform=function(t){return t.rotated(this.rot).multiply(this.scale).add(this.pos)},t.prototype.inverseTransform=function(t){return t.clone().subtract(this.pos).multiply(1/this.scale).rotate(-this.rot)},t.identity=new t(i.Vec2.zero,0,1),t}();e.Viewport=o;var r=function(){function t(t){this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.ctx.lineJoin="round",this.ctx.lineCap="round"}return t.prototype.drawShape=function(t,e,n,i,r){void 0===r&&(r=o.identity),this.setTransform(r.transform(e),n+r.rot,i*r.scale),this.setProps(t.props),this.ctx.beginPath(),this.ctx.moveTo(t.vertices[0].x,t.vertices[0].y);for(var s=1;s<t.vertices.length;++s)this.ctx.lineTo(t.vertices[s].x,t.vertices[s].y);this.ctx.closePath(),this.render(t.props)},t.prototype.drawLine=function(t,e,n,i){void 0===n&&(n={}),void 0===i&&(i=o.identity),this.setViewport(i),this.setProps(n);var r=[];n.lineDash&&(r=this.ctx.getLineDash(),this.ctx.setLineDash(n.lineDash)),this.ctx.beginPath(),this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(e.x,e.y),this.render(n),n.lineDash&&this.ctx.setLineDash(r)},t.prototype.drawRect=function(t,e,n,i){void 0===n&&(n={}),void 0===i&&(i=o.identity),this.setViewport(i),this.setProps(n);var r=Math.min(t.x,e.x),s=Math.min(t.y,e.y),a=Math.abs(e.x-t.x),c=Math.abs(e.y-t.y);n.fillColor&&this.ctx.fillRect(r,s,a,c),n.stroke&&this.ctx.strokeRect(r,s,a,c)},t.prototype.drawCircle=function(t,e,n,i){void 0===n&&(n={}),void 0===i&&(i=o.identity),this.setViewport(i),this.setProps(n),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,e,0,2*Math.PI),this.ctx.closePath(),this.render(n)},t.prototype.clear=function(){this.setIdentityTransform(),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},t.prototype.setProps=function(t){t.fillColor&&(this.ctx.fillStyle=t.fillColor),t.stroke&&(this.ctx.strokeStyle=t.stroke,t.lineWidth&&(this.ctx.lineWidth=t.lineWidth))},t.prototype.render=function(t){t.fillColor&&this.ctx.fill(),t.stroke&&this.ctx.stroke()},t.prototype.setViewport=function(t){t==o.identity?this.setIdentityTransform():this.setTransform(t.pos,t.rot,t.scale)},t.prototype.setIdentityTransform=function(){this.ctx.setTransform(1,0,0,1,0,0)},t.prototype.setTransform=function(t,e,n){var i=n*Math.cos(e),o=n*Math.sin(e);this.ctx.setTransform(i,o,-o,i,t.x,t.y)},t}();e.Renderer=r},function(t,e,n){"use strict";var i=n(11),o=n(0),r=n(2),s=n(5),a=n(6),c=n(18),u=n(16),l=n(1),h=n(20),p=function(){function t(t,e,n,i){this.cooldown=t,this.range=e,this.projectileSpeed=n,this.damage=i,this.cooldownRemaining=0}return t.t="Armed",t}();e.Armed=p;var d=function(){function t(t){this.entities=t}return t.prototype.update=function(t,e){var n=this;this.entities.forEachEntity([o.Position.t,a.AttackTarget.t,p.t],function(a,p){var d=p,f=d[0],v=d[1],m=d[2];m.cooldownRemaining=m.cooldownRemaining-t;var y=0;if(m.cooldownRemaining<0)y=-m.cooldownRemaining,m.cooldownRemaining=0;else if(m.cooldownRemaining>0)return;if(!n.entities.containsEntity(v.target))return void(v.target=null);var g=v.target.components[o.Position.t],w=g.pos.clone().subtract(f.pos);if(!(l.norm(w)>m.range)){var C=v.target.getOptionalComponents([s.Velocity.t])[0];m.cooldownRemaining=Math.max(m.cooldown-y,0),e.push(function(){var t=h.interceptVector(g.pos,C?C.vel:l.Vec2.zero,f.pos,m.projectileSpeed),e=t||w.normalized().multiply(m.projectileSpeed),a=new i.Entity((p={},p[o.Position.t]=new o.Position(f.pos.clone()),p[r.Cached.t+o.Position.t]=new r.Cached,p[o.Rotation.t]=new o.Rotation(e.angle()),p[r.Cached.t+o.Rotation.t]=new r.Cached,p[s.Velocity.t]=new s.Velocity(e),p[c.TracerEffect.t]=new c.TracerEffect,p[u.Projectile.t]=new u.Projectile(v.target,m.range,m.projectileSpeed,m.damage),p));n.entities.addEntity(a);var p})}})},t}();e.Shooting=d},function(t,e,n){"use strict";var i=function(){function t(t){this.name=t}return t.t="Named",t}();e.Named=i},function(t,e,n){"use strict";var i=n(0),o=n(5),r=n(6),s=n(9),a=n(1),c=n(20),u=function(){function t(t,e,n,i){this.speed=n,this.damage=i,this.target=null,this.lifetime=0,t.components[r.Targetable.t]&&(this.target=t),this.lifetime=e/n}return t.t="Projectile",t}();e.Projectile=u;var l=function(){function t(t){this.entities=t}return t.prototype.update=function(t,e){var n=this;this.entities.forEachEntity([i.Position.t,i.Rotation.t,o.Velocity.t,u.t],function(r,u){var l=u,h=l[0],p=l[1],d=l[2],f=l[3];if(f.lifetime<0)return void e.push(function(){n.entities.removeEntity(r)});if(f.lifetime-=t,!n.entities.containsEntity(f.target))return void(f.target=null);var v=f.target.getComponents([i.Position.t,o.Velocity.t]),m=v[0],y=v[1],g=f.target.getOptionalComponents([s.Damageable.t])[0];if(a.distance(m.pos,h.pos)<5)return g&&(g.hitpoints-=f.damage),void e.push(function(){n.entities.removeEntity(r)});var w=c.interceptVector(m.pos,y.vel,h.pos,f.speed);w&&(d.vel=w,p.angle=w.angle())})},t}();e.MoveProjectiles=l},function(t,e,n){"use strict";var i=n(0),o=n(2),r=n(3),s=function(){function t(t){this.shape=t}return t.t="RenderShape",t}();e.RenderShape=s;var a=function(){function t(t,e,n){this.entities=t,this.renderer=e,this.viewport=n}return t.prototype.update=function(t,e,n){var a=this;this.entities.forEachEntity([s.t,i.Position.t],function(t,n){var s=n,c=s[0],u=s[1],l=t.getOptionalComponents([i.Rotation.t,o.Cached.t+i.Position.t,o.Cached.t+i.Rotation.t]),h=l[0],p=l[1],d=l[2];a.renderer.drawShape(c.shape,r.interpolatePosition(u,p,e),h?r.interpolateRotation(h,d,e):0,1,a.viewport)})},t}();e.ShapeRenderer=a},function(t,e,n){"use strict";var i=n(0),o=n(2),r=n(5),s=n(3),a=function(){function t(){}return t.t="TracerEffect",t}();e.TracerEffect=a;var c=function(){function t(t,e,n){this.entities=t,this.renderer=e,this.viewport=n}return t.prototype.update=function(e,n,c){var u=this;this.entities.forEachEntity([i.Position.t,r.Velocity.t,a.t],function(e,r){var a=r,c=a[0],l=a[1],h=e.getOptionalComponents([o.Cached.t+i.Position.t])[0],p=s.interpolatePosition(c,h,n),d=p.clone().add(l.vel.clone().multiply(1/60));u.renderer.drawLine(p,d,t.tracerProps,u.viewport)})},t.tracerProps={stroke:"rgb(245, 245, 220)",lineWidth:2.5},t}();e.RenderTracer=c},function(t,e,n){"use strict";function i(t,e){return t-Math.floor(t/e)*e}function o(t){return t=i(t,2*Math.PI),t<0&&(t+=2*Math.PI),t}function r(t,e){var n=i(e-t+Math.PI,2*Math.PI);return n+(n<0?Math.PI:-Math.PI)}e.wrapAngle=o,e.angleDiff=r},function(t,e,n){"use strict";function i(t,e,n,i){if(i<=0)return null;var r=t.clone().subtract(n),s=o.norm2(e)-i*i,a=2*o.dot(e,r),c=o.norm2(r);if(0==s){var u=-c/a;return u>0?r.multiply(1/u).add(e).normalize().multiply(i):null}var l=a*a-4*s*c;if(l<0)return null;var h=(-a-Math.sqrt(l))/(2*s),p=(-a+Math.sqrt(l))/(2*s),d=h>0&&h>p?h:p;return d>0?r.multiply(1/d).add(e).normalize().multiply(i):null}var o=n(1);e.interceptVector=i},function(t,e,n){"use strict";function i(t){return/^on/.test(t)}function o(t){return t.slice(2).toLowerCase()}function r(t,e,n){i(e)||t.setAttribute(e,n)}function s(t,e){Object.keys(e).forEach(function(n){return r(t,n,e[n])})}function a(t,e,n){i(e)||t.removeAttribute(e)}function c(t,e,n,i){n?i&&i===n||r(t,e,n):a(t,e,i)}function u(t,e,n){void 0===n&&(n={});var i=Object.assign({},e,n);Object.keys(i).forEach(function(i){return c(t,i,e[i],n[i])})}function l(t,e){Object.keys(e).forEach(function(n){i(n)&&t.addEventListener(o(n),e[n])})}function h(t){return void 0!==t.type}function p(t){if("string"==typeof t)return document.createTextNode(t);var e=document.createElement(t.type);return s(e,t.props),l(e,t.props),t.children.map(p).forEach(function(t){return e.appendChild(t)}),e}function d(t,e){return typeof t!=typeof e||"string"==typeof t&&t!==e||t.type!==e.type}function f(t,e,n){for(var i=0;i<Math.min(e.children.length,n.children.length);++i)d(e.children[i],n.children[i])?t.replaceChild(p(e.children[i]),t.childNodes[i]):h(e.children[i])&&(u(t.childNodes[i],e.children[i].props,n.children[i].props),f(t.childNodes[i],e.children[i],n.children[i]));if(n.children.length>e.children.length)for(var i=n.children.length-1;i>=e.children.length;--i)t.removeChild(t.childNodes[i]);else if(e.children.length>n.children.length)for(var i=n.children.length;i<e.children.length;++i)t.appendChild(p(e.children[i]))}var v=function(){function t(t,e,n){this.type=t,this.props=e,this.children=n}return t.create=function(t,e){for(var n=[],i=2;i<arguments.length;i++)n[i-2]=arguments[i];return{type:t,props:e,children:n.filter(function(t){return null!==t})}},t}();e.VdomElement=v,e.createElement=p,e.updateElementChildren=f},function(t,e,n){"use strict";var i=n(26),o=n(13),r=n(38),s=n(21),a=function(){function t(t){var e=this;this.$root=t,this.$root.appendChild(s.createElement(s.VdomElement.create("ul",{class:"menu"},s.VdomElement.create("li",{},s.VdomElement.create("a",{href:"",class:"btn",onclick:function(t){e.runGame(document.getElementById("fullscreen").checked),t.preventDefault()}},"Start"))))),this.$root.appendChild(s.createElement(s.VdomElement.create("div",{class:"title"},"Ships"))),this.$root.appendChild(s.createElement(s.VdomElement.create("div",{class:"fullscreen"},s.VdomElement.create("input",{id:"fullscreen",type:"checkbox"}),s.VdomElement.create("label",{for:"fullscreen"},"Start fullscreen"))))}return t.mount=function(e){return e.addEventListener("contextmenu",function(t){t.preventDefault()}),new t(e)},t.prototype.runGame=function(t){var e=this,n=document.createElement("canvas");r.fullscreenAvailable()&&(t&&r.setFullscreen(this.$root),document.addEventListener("keydown",function(t){13===t.keyCode&&(r.isFullscreen()?r.disableFullscreen():r.setFullscreen(e.$root))}));var s=function(){n.width=window.innerWidth,n.height=window.innerHeight};for(s(),window.addEventListener("resize",s);this.$root.firstChild;)this.$root.removeChild(this.$root.firstChild);this.$root.appendChild(n);var a=new o.Renderer(n);new i.Game(this.$root,n,a).start(60)},t}();e.App=a},function(t,e){},function(t,e,n){"use strict";var i=n(11),o=n(2),r=n(0),s=n(5),a=n(17),c=n(7),u=n(4),l=n(15),h=n(8),p=n(6),d=n(12),f=n(14),v=n(9),m=n(27),y=n(1),g=function(){function t(){}return t.makeShip=function(t,e,n,m,g){return new i.Entity((w={},w[r.Position.t]=new r.Position(t),w[r.Rotation.t]=new r.Rotation(e),w[s.Velocity.t]=new s.Velocity(new y.Vec2(0,0)),w[s.AngularVelocity.t]=new s.AngularVelocity(0),w[a.RenderShape.t]=new a.RenderShape(m),w[o.Cached.t+r.Position.t]=new o.Cached,w[o.Cached.t+r.Rotation.t]=new o.Cached,w[c.MoveToTarget.t]=new c.MoveToTarget,w[u.Selectable.t]=new u.Selectable,w[l.Named.t]=new l.Named(n),w[h.Controlled.t]=new h.Controlled(g),w[p.Targetable.t]=new p.Targetable,w[p.AttackTarget.t]=new p.AttackTarget,w[d.Clickable.t]=new d.Clickable(15),w[f.Armed.t]=new f.Armed(.75,1e3,350,20),w[v.Damageable.t]=new v.Damageable(300),w));var w},t.Box=new m.Shape({stroke:"black",lineWidth:5,fillColor:"gray"},[new y.Vec2(-35,-35),new y.Vec2(-25,25),new y.Vec2(25,25),new y.Vec2(25,-25)]),t.shipVertices=[new y.Vec2(0,-15),new y.Vec2(-12,15),new y.Vec2(0,10.5),new y.Vec2(12,15)],t.Ship=new m.Shape({stroke:"hsla(207, 100%, 60%, 1)",lineWidth:3,fillColor:"hsla(207, 100%, 30%, 0.8)"},t.shipVertices),t.NeutralShip=new m.Shape({stroke:"hsla(120, 100%, 60%, 1)",lineWidth:3,fillColor:"hsla(120, 100%, 30%, 0.8)"},t.shipVertices),t}();e.Static=g},function(t,e,n){"use strict";var i=function(){function t(){this.queue=[]}return t.prototype.push=function(t){this.queue.push(t)},t.prototype.flush=function(){for(var t=0,e=this.queue;t<e.length;t++){(0,e[t])()}this.queue=[]},t}();e.Deferred=i},function(t,e,n){"use strict";var i=n(11),o=n(25),r=n(3),s=n(28),a=n(7),c=n(31),u=n(34),l=n(30),h=n(4),p=n(17),d=n(35),f=n(36),v=n(8),m=n(32),y=n(29),g=n(12),w=n(14),C=n(16),E=n(9),P=n(18),x=n(33),b=n(10),M=n(13),V=n(1),k=n(24),S=n(39),R=function(){function t(t,e,n){this.renderer=n,this.lastUpdate=0,this.lastDraw=0,this.fps=0,this.entityContainer=new i.EntityContainer,this.updateSystems=[],this.renderSystems=[],this.viewport=M.Viewport.identity,this.players=[],this.ui=new b.UiManager(this.entityContainer,t,e);var o=new v.Player(v.PlayerType.Local),k=new v.Player(v.PlayerType.Ai);this.players=[o,k],this.updateSystems=[new r.CachePosition(this.entityContainer),new r.CacheRotation(this.entityContainer),new c.ChooseRandomMoveTarget(this.entityContainer,k,new V.Vec2(0,0),new V.Vec2(1e3,1e3)),new a.MoveTo(this.entityContainer,50,Math.PI/3),new C.MoveProjectiles(this.entityContainer),new w.Shooting(this.entityContainer),new s.MoveKinematic(this.entityContainer),new E.CheckDestroyed(this.entityContainer)],this.viewport=new M.Viewport(new V.Vec2(0,0),0,1),this.renderSystems=[new g.UpdateClickable(this.entityContainer,this.viewport),new f.ViewportController(this.ui,1e3,2,this.viewport),new h.SelectionSystem(this.entityContainer,o,this.ui,n,this.viewport),new l.OrderMove(this.entityContainer,o,this.ui,this.viewport),new y.OrderAttack(this.entityContainer,o,this.ui,this.viewport),new u.RenderMoveTarget(this.entityContainer,n,this.viewport),new m.RenderAttackTarget(this.entityContainer,n,this.viewport),new p.ShapeRenderer(this.entityContainer,n,this.viewport),new P.RenderTracer(this.entityContainer,n,this.viewport),new x.RenderHealthBar(this.entityContainer,n,this.viewport),new d.StatusWindow(this.entityContainer,this.ui)]}return t.prototype.start=function(t){var e=this;this.fps=t,this.lastUpdate=performance.now(),this.lastDraw=performance.now();for(var n=function(){setTimeout(n,1e3/e.fps);var t=performance.now(),i=(t-e.lastUpdate)/1e3;e.lastUpdate=t,e.update(i)},i=function(t){requestAnimationFrame(i);var n=(t-e.lastDraw)/1e3;e.lastDraw=t;var o=e.fps*(t-e.lastUpdate)/1e3;e.draw(n,o)},o=new V.Vec2(50,50),r=new V.Vec2(600,600),s=S.shuffle(["Arethusa","Aurora","Galatea","Penelope","Phaeton","Bonaventure","Dido","Argonaut","Scylla","Swiftsure","Minotaur","Bellerophon","Vanguard","Collosus","Audacious","Warspite","Valiant"]),a=0;a<5;++a)this.entityContainer.addEntity(k.Static.makeShip(V.Vec2.random().elementMultiply(r).add(o),0,s[a],k.Static.Ship,this.players[0]));for(var a=5;a<10;++a)this.entityContainer.addEntity(k.Static.makeShip(V.Vec2.random().elementMultiply(r).add(o),0,s[a],k.Static.NeutralShip,this.players[1]));setTimeout(n,1e3/this.fps),requestAnimationFrame(i)},t.prototype.update=function(t){for(var e=new o.Deferred,n=0,i=this.updateSystems;n<i.length;n++){i[n].update(t,e)}e.flush()},t.prototype.draw=function(t,e){this.renderer.clear();for(var n=new o.Deferred,i=0,r=this.renderSystems;i<r.length;i++){r[i].update(t,e,n)}n.flush()},t}();e.Game=R},function(t,e,n){"use strict";var i=function(){function t(t,e){this.props=t,this.vertices=e}return t}();e.Shape=i},function(t,e,n){"use strict";var i=n(0),o=n(5),r=function(){function t(t){this.entities=t}return t.prototype.update=function(t,e){this.entities.forEachEntity([i.Position.t,o.Velocity.t],function(e,n){var i=n,o=i[0],r=i[1];o.pos.add(r.vel.clone().multiply(t))}),this.entities.forEachEntity([i.Rotation.t,o.AngularVelocity.t],function(e,n){var i=n,o=i[0],r=i[1];o.angle+=r.vel*t})},t}();e.MoveKinematic=r},function(t,e,n){"use strict";var i=n(10),o=n(6),r=n(4),s=n(8),a=function(){function t(t,e,n,a){var c=this;this.entities=t,this.player=e,n.addEventListener("entityclick",function(t){if(t.button===i.MouseButton.Right)for(var e=function(t){var e=t.getComponents([s.Controlled.t,o.Targetable.t]);if(!e)return"continue";var n=e,i=n[0];n[1];return i.player!==c.player?(c.entities.forEachEntity([r.Selected.t,o.AttackTarget.t,s.Controlled.t],function(e,n){var i=n,o=i[1];i[2].player===c.player&&o.setTarget(t)}),"break"):void 0},n=0,a=t.entities;n<a.length;n++){var u=a[n],l=e(u);if("break"===l)break}})}return t.prototype.update=function(t,e,n){},t}();e.OrderAttack=a},function(t,e,n){"use strict";var i=n(10),o=n(7),r=n(4),s=n(8),a=function(){function t(t,e,n,a){var c=this;this.entities=t,this.player=e,n.addEventListener("click",function(t){t.button===i.MouseButton.Right&&c.entities.forEachEntity([r.Selected.t,o.MoveToTarget.t,s.Controlled.t],function(e,n){var i=n,o=i[1];i[2].player===c.player&&(o.target=a.inverseTransform(t.pos))})})}return t.prototype.update=function(t,e,n){},t}();e.OrderMove=a},function(t,e,n){"use strict";var i=n(7),o=n(8),r=n(1),s=function(){function t(t,e,n,i){this.entities=t,this.player=e,this.min=n,this.size=i.clone().subtract(n)}return t.prototype.update=function(t,e){var n=this;this.entities.forEachEntity([i.MoveToTarget.t,o.Controlled.t],function(t,e){var i=e,o=i[0];i[1].player!==n.player||o.target||(o.target=n.min.clone().add(new r.Vec2(Math.random(),Math.random()).elementMultiply(n.size)))})},t}();e.ChooseRandomMoveTarget=s},function(t,e,n){"use strict";var i=n(6),o=n(4),r=n(0),s=n(2),a=n(3),c=function(){function t(t,e,n){this.entities=t,this.renderer=e,this.viewport=n}return t.prototype.update=function(e,n,c){var u=this;this.entities.forEachEntity([o.Selected.t,i.AttackTarget.t],function(e,i){var o=i,c=o[1];if(!u.entities.containsEntity(c.target))return void(c.target=null);var l=c.target.getComponents([r.Position.t])[0],h=c.target.getOptionalComponents([s.Cached.t+r.Position.t])[0],p=a.interpolatePosition(l,h,n);u.renderer.drawCircle(p,10,t.targetProps,u.viewport),u.renderer.drawCircle(p,5,t.targetProps,u.viewport);var d=e.getOptionalComponents([r.Position.t,s.Cached.t+r.Position.t]),f=d[0],v=d[1];f&&u.renderer.drawLine(p,a.interpolatePosition(f,v,n),t.targetProps,u.viewport)})},t.targetProps={stroke:"rgb(255, 0, 0)",lineWidth:1,lineDash:[1,7]},t}();e.RenderAttackTarget=c},function(t,e,n){"use strict";var i=n(0),o=n(2),r=n(3),s=n(4),a=n(9),c=n(1),u=n(37),l=function(){function t(t,e,n){this.entities=t,this.renderer=e,this.viewport=n}return t.prototype.update=function(e,n,l){var h=this;this.entities.forEachEntity([i.Position.t,a.Damageable.t],function(e,a){var l=a,p=l[0],d=l[1];if(e.getOptionalComponents([s.Selected.t])[0]||d.hitpoints!==d.maxHitpoints){var f=e.getOptionalComponents([o.Cached.t+i.Position.t])[0],v=u.clamp(d.hitpoints/d.maxHitpoints,0,1),m=h.viewport.transform(r.interpolatePosition(p,f,n)).add(t.offset);h.renderer.drawRect(m,t.size.clone().elementMultiply(new c.Vec2(v,1)).add(m),t.greenBarProps),h.renderer.drawRect(t.size.clone().elementMultiply(new c.Vec2(v,0)).add(m),m.add(t.size),t.redBarProps)}})},t.offset=new c.Vec2(-20,-25),t.size=new c.Vec2(40,3),t.redBarProps={fillColor:"rgb(255, 0, 0)"},t.greenBarProps={fillColor:"rgb(0, 255, 0)"},t}();e.RenderHealthBar=l},function(t,e,n){"use strict";var i=n(7),o=n(4),r=n(0),s=n(2),a=n(3),c=function(){function t(t,e,n){this.entities=t,this.renderer=e,this.viewport=n}return t.prototype.update=function(e,n,c){var u=this;this.entities.forEachEntity([o.Selected.t,i.MoveToTarget.t],function(e,i){var o=i,c=o[1];if(c.target){u.renderer.drawCircle(c.target,10,t.targetProps,u.viewport),u.renderer.drawCircle(c.target,5,t.targetProps,u.viewport);var l=e.getOptionalComponents([r.Position.t,s.Cached.t+r.Position.t]),h=l[0],p=l[1];h&&u.renderer.drawLine(a.interpolatePosition(h,p,n),c.target,t.targetProps,u.viewport)}})},t.targetProps={stroke:"rgb(0, 255, 0)",lineWidth:1,lineDash:[5,15]},t}();e.RenderMoveTarget=c},function(t,e,n){"use strict";function i(t){return t.x.toFixed()+" : "+t.y.toFixed()}function o(t,e,n,o,r,s){var a=[];return t&&a.push(i(u.interpolatePosition(t,e,r))),n&&a.push((180*y.wrapAngle(u.interpolateRotation(n,o,r))/Math.PI).toFixed()+"°"),s&&a.push(m.norm(s.vel).toFixed()),a.join(" | ")}function r(t){var e=t.getOptionalComponents([p.Named.t])[0];return e?e.name:null}var s=n(4),a=n(2),c=n(0),u=n(3),l=n(5),h=n(7),p=n(15),d=n(6),f=n(9),v=n(21),m=n(1),y=n(19),g=function(){function t(t,e){this.entities=t,this.ui=e,this.elem=v.VdomElement.create("div",{class:"window"}),this.$elem=v.createElement(this.elem)}return t.prototype.update=function(t,e,n){var u=this,m=v.VdomElement.create("div",{class:"window"});this.entities.forEachEntity([s.Selected.t],function(t,n){var s=t.getOptionalComponents([p.Named.t,c.Position.t,a.Cached.t+c.Position.t,c.Rotation.t,a.Cached.t+c.Rotation.t,l.Velocity.t,h.MoveToTarget.t,d.AttackTarget.t,f.Damageable.t]),y=s[0],g=s[1],w=s[2],C=s[3],E=s[4],P=s[5],x=s[6],b=s[7],M=s[8];m.children.push(v.VdomElement.create("div",{class:"ship"},y?v.VdomElement.create("span",{class:"name"},y.name):null,M?v.VdomElement.create("span",{class:"hp"},M.hitpoints.toFixed()+"/"+M.maxHitpoints.toFixed()):null,g||C||P?v.VdomElement.create("span",{class:"pos"},o(g,w,C,E,e,P)):null,x&&x.target?v.VdomElement.create("span",{class:"tgt"},i(x.target)):null,b&&u.entities.containsEntity(b.target)?v.VdomElement.create("span",{class:"atk"},r(b.target)):null))}),v.updateElementChildren(this.$elem,m,this.elem),this.elem=m,0==this.elem.children.length?this.$elem.parentNode&&this.ui.removeElement(this.$elem):this.$elem.parentNode||this.ui.addElement(this.$elem)},t}();e.StatusWindow=g},function(t,e,n){"use strict";var i=n(10),o=n(1),r=function(){function t(t,e,n,o){var r=this;this.ui=t,this.scrollSpeed=e,this.scaleRatio=n,this.viewport=o,this.dragging=!1,t.addEventListener("dragstart",function(t){t.button===i.MouseButton.Right&&(r.lastMousePos=t.pos.clone(),r.dragging=!0)}),t.addEventListener("dragend",function(t){t.button===i.MouseButton.Right&&(r.dragging=!1)}),t.addEventListener("wheel",function(t){var e=t.pos?t.pos:r.ui.canvasDimensions().multiply(.5),n=Math.pow(r.scaleRatio,-t.delta);r.viewport.scale*=n,r.viewport.pos=e.add(r.viewport.pos.clone().subtract(e).multiply(n))})}return t.prototype.update=function(t,e,n){var i=this.ui.mousePosition();if(i){if(this.dragging)this.viewport.pos.add(i.clone().subtract(this.lastMousePos));else{var r=new o.Vec2(0,0),s=i.x/this.ui.canvasWidth(),a=i.y/this.ui.canvasHeight();s<.1?r.x=Math.pow(o.lerp(1,0,s/.1),2):s>.9&&(r.x=-Math.pow(o.lerp(0,1,(s-.9)/.1),2)),a<.1?r.y=Math.pow(o.lerp(1,0,a/.1),2):a>.9&&(r.y=-Math.pow(o.lerp(0,1,(a-.9)/.1),2)),this.viewport.pos.add(r.multiply(this.scrollSpeed*t))}this.lastMousePos=i.clone()}},t}();e.ViewportController=r},function(t,e,n){"use strict";function i(t,e,n){return Math.min(Math.max(t,e),n)}e.clamp=i},function(t,e,n){"use strict";function i(){return"fullscreenEnabled"in document?document.fullscreenEnabled:"webkitFullscreenEnabled"in document?document.webkitFullscreenEnabled:"mozFullScreenEnabled"in document&&document.mozFullScreenEnabled}function o(t){return"fullscreenElement"in document?!document.fullscreenElement&&(t.requestFullscreen(),!0):"webkitFullscreenElement"in document?!document.webkitFullscreenElement&&(t.webkitRequestFullscreen(),!0):"mozFullScreenElement"in document&&(!document.mozFullScreenElement&&(t.mozRequestFullScreen(),!0))}function r(){document.fullscreenElement&&document.exitFullscreen?document.exitFullscreen():document.webkitFullscreenElement&&document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozFullScreenElement&&document.mozCancelFullScreen&&document.mozCancelFullScreen()}function s(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement}e.fullscreenAvailable=i,e.setFullscreen=o,e.disableFullscreen=r,e.isFullscreen=s},function(t,e,n){"use strict";function i(t){for(var e=t.length-1;e>0;--e){var n=Math.floor(Math.random()*(e+1)),i=t[e];t[e]=t[n],t[n]=i}return t}e.shuffle=i},function(t,e,n){"use strict";var i=n(22);n(23),i.App.mount(document.getElementById("content"))}]);
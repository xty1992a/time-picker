/**
 * Created by TY-xie on 2018/3/29.
 */
import './index.less'
import {css, getParentByClassName, isMobile, getObjectURL, dataURLtoBlob} from './dom'
import pickStore from './TimeAction'
import request from './request'

const defaultOptions = {}

class EmitAble {
  task = {}

  on(event, callback) {
	this.task[event] = callback
  }

  fire(event, payload) {
	this.task[event] && this.task[event](payload)
  }
}

export default class ImageUploader extends EmitAble {
  constructor(opt) {
	super()
	this.$options = {
	  ...defaultOptions,
	  ...opt,
	}
	if (opt.el && opt.el instanceof Element) {
	  this.insertDom()
	}
  }

  show() {
  }

  hide() {
  }

  pickStore = () => {
  }

}

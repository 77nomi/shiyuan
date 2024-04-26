// components/Tabs.js
Component({
  properties: {
  tabs:{
    type:Array,
    value:[]
  }
  },
  data: {
    type1: 0,
    type2: 0,
  },

  methods: {
    handleItemTap(e){
      const {index} =e.currentTarget.dataset;
      this.triggerEvent("tabsItemChange",{index});
    }
  }
})

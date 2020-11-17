$(document).ready(function() { 
    $('.ui.dropdown').dropdown(); 
});

var list = new Vue({
    el: '#list',
    data: {
        counter: 0,
        datas,
        count: datas.length
    },
    methods: {
        filtering: function (type, word, hasInst, hasLisence) {
            let result = datas;
            console.log(type);

            result = datas.filter( i => { 
                console.log(i.artist);
                return (type == 0 ? i.song_name : i.artist).indexOf(word) != -1
            }, this);
            
            if (hasInst || hasLisence) {
                result = result.filter( i => { 
                    return i.inst_url.indexOf("Not Found") == -1
                }, this);
            }

            if (hasLisence) {
                result = result.filter( i => { 
                    return i.lisence.indexOf("Not Found") == -1
                }, this);
            }
            this.count = result.length
            
            this.datas = result;
        }
    }
});

var search = new Vue({
    el: '#search',
    methods: {
        search: function (event) {
            list.filtering(this.$refs.type.value, this.$refs.word.value, this.$refs.hasInst.checked, this.$refs.hasLisence.checked);
        }
    }
});
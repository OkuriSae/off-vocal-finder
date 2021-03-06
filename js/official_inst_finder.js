$(document).ready(() => { 
    $('.ui.dropdown').dropdown(); 

    decodeURIComponent(window.location.search)
    .split('&')
    .forEach((qs) => {
        if (qs.split('q=')[1]){
            search.q = qs.split('q=')[1];
            search.$refs.word.value = search.q;
            search.search();
        }
    });
});

function makeRecommend() {
    return [
        datas[Math.floor(Math.random()*datas.length)],
        datas[Math.floor(Math.random()*datas.length)],
        datas[Math.floor(Math.random()*datas.length)],
    ];
}

const recommend = new Vue({
    el: '#recommend',
    data: {
        recommends: makeRecommend()
    },
    methods: {
        reflesh : function () {
            this.recommends = makeRecommend();
        }
    }
});

const list = new Vue({
    el: '#list',
    data: {
        counter: 0,
        datas,
        start: 1,
        end: 20
    },
    methods: {
        filtering: function (type, word, hasInst, hasLisence, start, end) {
            let result = datas;

            result = datas.filter( i => { 
                switch (type) {
                    case "":
                    case "0":
                        return `${i.song_name} / ${i.artist}`.match(new RegExp(word.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'), 'i'));
                    case "1":
                        return i.song_name.match(new RegExp(word, 'i'));
                    case "2":
                        return i.artist.match(new RegExp(word, 'i'));
                }
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
            
            this.datas = result;
            this.paging(start, end);
            recommend.reflesh();
        },
        paging: function (start, end) {
            start = (start < 1) ? 1 : start;
            end = (this.datas.length < end) ? this.datas.length : end;
            end = (end < 1) ? 1 : end;
            this.start = start;
            this.end = end;
        } 
    }
});

const search = new Vue({
    el: '#search',
    data: {
        q: ""
    },
    methods: {
        search: function (event) {
            list.filtering(
                this.$refs.type.value, 
                this.$refs.word.value, 
                this.$refs.hasInst.checked, 
                this.$refs.hasLisence.checked,
                paging.$refs.start.value,
                paging.$refs.end.value);
        }
    }
});

const paging = new Vue({
    el: '#paging',
    methods: {
        paging: function (event) {
            list.paging(this.$refs.start.value, this.$refs.end.value);
        }
    }
});

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
        filtering: function (category, word, isJasracOrNexTone, start, end) {
            let result = datas;

            if (category && !(category == "all")) {
                result = result.filter( i => { 
                    return i.category == category
                }, this);
            }

            result = result.filter( i => {
                return `${i.song_name} / ${i.artist}`.match(new RegExp(word.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'), 'i'));
            }, this);
            
            if (isJasracOrNexTone) {
                result = result.filter( i => {
                    return i.rigths_holder == "JASRAC" || i.rigths_holder == "NexTone" 
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
                this.$refs.category.value, 
                this.$refs.word.value, 
                this.$refs.isJasracOrNexTone.checked,
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
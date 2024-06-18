const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            contents: [], // 全てのコンテンツ
            totalContents: 0, // 全コンテンツの数を保持する変数
            selectedTags: [], // 選択されたタグを配列で保持
            searchKeyword: '' // 検索キーワード
        };
    },
    methods: {
        fetchData() {
            const { createClient } = microcms;
            const client = createClient({
                serviceDomain: "jun",
                apiKey: "T0kiB3RhwkBSvCivTqfuUX27IDwC6ivYdxKr"
            });

            client.get({
                endpoint: "dinoimge"
            }).then((res) => {
                // データを取得できているか確認するためにコンソールに出力
                console.log(res);

                // データをVueアプリケーションのデータとして設定
                this.contents = this.shuffleArray(res.contents); // contents データを設定                
                this.totalContents = res.totalCount; // 全コンテンツの数を設定
            }).catch((error) => {
                // エラーがあればコンソールに出力
                console.error("Error fetching data from microcms:", error);
            });
        },
        shuffleArray(array) {
            // 配列をランダムにシャッフルする関数
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        toggleTag(tag) {
            if (tag === 'ALL') {
                // 'ALL' が選択された場合は他のタグを全て解除し、'ALL' のみを選択
                this.selectedTags = ['ALL'];
            } else {
                // 'ALL' が選択されていない場合は 'ALL' を解除
                this.selectedTags = this.selectedTags.filter(t => t !== 'ALL');
    
                if (this.selectedTags.includes(tag)) {
                    // タグが既に選択されている場合は解除
                    this.selectedTags = this.selectedTags.filter(t => t !== tag);
                } else {
                    // タグが選択されていない場合は追加
                    this.selectedTags.push(tag);
                }

                // タグが全て解除された場合は 'ALL' に戻す
                if (this.selectedTags.length === 0) {
                    this.selectedTags = ['ALL'];
                }
            }
        },
        speak(name) {
            const utterance = new SpeechSynthesisUtterance(name);
            // utterance.lang='ja'
            speechSynthesis.speak(utterance);
        },
        speake(name) {
            const utterance = new SpeechSynthesisUtterance(name);
            utterance.lang='en-US'
            speechSynthesis.speak(utterance);
        }
    },
    computed: {
        filteredContents() {
            return this.contents.filter(content => {
                // 全てのselectedTagsがcontent.eatまたはcontent.eraに含まれているか確認
                const matchesTags = this.selectedTags.includes('ALL') ||
                    (this.selectedTags.every(tag => (content.eat && content.eat.includes(tag)) || 
                    (content.era && content.era.includes(tag)) ||
                    (content.type1 && content.type0.includes(tag))||
                    (content.type2 && content.type2.includes(tag))||
                    (content.type3 && content.type3.includes(tag))||
                    (content.type4 && content.type4.includes(tag))
                    ));
                const matchesSearch = content.name.toLowerCase().includes(this.searchKeyword.toLowerCase());
                return matchesTags && matchesSearch;
            });
        },
        truncatedPercentage() {
            return Math.floor((this.totalContents / 50) * 100);
        }
    },
    mounted() {
        // データを取得するメソッドをマウント時に呼び出し
        this.fetchData();
    }
});

app.component("textv", {
    template: '<p>aaaaaa</p>'
});

app.mount("#app");

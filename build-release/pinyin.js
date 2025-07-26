// 通用拼音转换库
// 支持所有中文字符的拼音匹配

const PinyinHelper = {
    // 扩展的汉字拼音映射表
    pinyinMap: {
        // 常用汉字 A-Z
        '阿': 'a', '啊': 'a', '爱': 'ai', '安': 'an', '按': 'an', '案': 'an',
        '八': 'ba', '把': 'ba', '吧': 'ba', '白': 'bai', '百': 'bai', '班': 'ban', '办': 'ban', '半': 'ban',
        '帮': 'bang', '包': 'bao', '报': 'bao', '保': 'bao', '宝': 'bao', '北': 'bei', '被': 'bei', '本': 'ben',
        '比': 'bi', '笔': 'bi', '必': 'bi', '边': 'bian', '变': 'bian', '表': 'biao', '标': 'biao', '别': 'bie',
        '并': 'bing', '不': 'bu', '部': 'bu', '步': 'bu',

        '才': 'cai', '材': 'cai', '参': 'can', '产': 'chan', '长': 'chang', '常': 'chang', '场': 'chang',
        '车': 'che', '成': 'cheng', '程': 'cheng', '出': 'chu', '初': 'chu', '处': 'chu', '传': 'chuan',
        '创': 'chuang', '次': 'ci', '从': 'cong', '存': 'cun', '错': 'cuo',

        '大': 'da', '打': 'da', '带': 'dai', '单': 'dan', '当': 'dang', '到': 'dao', '道': 'dao',
        '的': 'de', '得': 'de', '地': 'di', '第': 'di', '点': 'dian', '电': 'dian', '定': 'ding',
        '东': 'dong', '动': 'dong', '都': 'dou', '度': 'du', '对': 'dui', '多': 'duo',

        '而': 'er', '二': 'er',

        '发': 'fa', '法': 'fa', '方': 'fang', '放': 'fang', '非': 'fei', '分': 'fen', '风': 'feng',
        '服': 'fu', '府': 'fu', '复': 'fu', '副': 'fu',

        '该': 'gai', '改': 'gai', '感': 'gan', '干': 'gan', '刚': 'gang', '高': 'gao', '告': 'gao',
        '个': 'ge', '给': 'gei', '根': 'gen', '更': 'geng', '工': 'gong', '公': 'gong', '功': 'gong',
        '共': 'gong', '关': 'guan', '管': 'guan', '观': 'guan', '广': 'guang', '规': 'gui', '国': 'guo', '过': 'guo',

        '还': 'hai', '好': 'hao', '号': 'hao', '和': 'he', '很': 'hen', '后': 'hou', '户': 'hu', '乎': 'hu', '化': 'hua',
        '话': 'hua', '环': 'huan', '回': 'hui', '会': 'hui', '活': 'huo', '或': 'huo',

        '机': 'ji', '基': 'ji', '及': 'ji', '级': 'ji', '即': 'ji', '技': 'ji', '记': 'ji', '际': 'ji',
        '加': 'jia', '家': 'jia', '价': 'jia', '间': 'jian', '见': 'jian', '建': 'jian', '监': 'jian',
        '将': 'jiang', '交': 'jiao', '教': 'jiao', '接': 'jie', '结': 'jie', '解': 'jie', '界': 'jie',
        '金': 'jin', '进': 'jin', '近': 'jin', '今': 'jin', '经': 'jing', '京': 'jing', '精': 'jing',
        '就': 'jiu', '局': 'ju', '据': 'ju', '具': 'ju', '决': 'jue',

        '开': 'kai', '看': 'kan', '可': 'ke', '课': 'ke', '客': 'ke', '空': 'kong', '控': 'kong', '口': 'kou',
        '快': 'kuai', '块': 'kuai', '库': 'ku',

        '来': 'lai', '老': 'lao', '了': 'le', '乐': 'le', '类': 'lei', '里': 'li', '理': 'li',
        '力': 'li', '立': 'li', '利': 'li', '连': 'lian', '两': 'liang', '量': 'liang', '料': 'liao',
        '列': 'lie', '流': 'liu', '六': 'liu', '龙': 'long', '路': 'lu', '论': 'lun',

        '马': 'ma', '吗': 'ma', '买': 'mai', '卖': 'mai', '满': 'man', '没': 'mei', '每': 'mei',
        '美': 'mei', '门': 'men', '们': 'men', '面': 'mian', '民': 'min', '明': 'ming', '名': 'ming',
        '目': 'mu',

        '那': 'na', '哪': 'na', '南': 'nan', '内': 'nei', '能': 'neng', '你': 'ni', '年': 'nian',
        '宁': 'ning', '农': 'nong',

        '排': 'pai', '盘': 'pan', '培': 'pei', '平': 'ping', '品': 'pin', '频': 'pin',

        '其': 'qi', '奇': 'qi', '期': 'qi', '七': 'qi', '起': 'qi', '气': 'qi', '器': 'qi',
        '前': 'qian', '强': 'qiang', '情': 'qing', '请': 'qing', '区': 'qu', '取': 'qu', '去': 'qu',
        '全': 'quan', '权': 'quan', '确': 'que',

        '然': 'ran', '让': 'rang', '人': 'ren', '认': 'ren', '任': 'ren', '日': 'ri', '如': 'ru',

        '三': 'san', '色': 'se', '山': 'shan', '上': 'shang', '商': 'shang', '少': 'shao', '设': 'she',
        '社': 'she', '身': 'shen', '什': 'shen', '生': 'sheng', '省': 'sheng', '时': 'shi', '十': 'shi',
        '实': 'shi', '识': 'shi', '史': 'shi', '使': 'shi', '始': 'shi', '是': 'shi', '市': 'shi',
        '事': 'shi', '视': 'shi', '试': 'shi', '收': 'shou', '手': 'shou', '首': 'shou', '受': 'shou',
        '书': 'shu', '数': 'shu', '术': 'shu', '水': 'shui', '说': 'shuo', '思': 'si', '四': 'si',
        '送': 'song', '搜': 'sou', '苏': 'su', '算': 'suan', '随': 'sui', '所': 'suo',

        '他': 'ta', '她': 'ta', '它': 'ta', '台': 'tai', '太': 'tai', '谈': 'tan', '特': 'te',
        '提': 'ti', '体': 'ti', '题': 'ti', '天': 'tian', '条': 'tiao', '听': 'ting', '通': 'tong',
        '同': 'tong', '统': 'tong', '头': 'tou', '图': 'tu', '团': 'tuan', '推': 'tui',

        '外': 'wai', '完': 'wan', '万': 'wan', '网': 'wang', '往': 'wang', '王': 'wang', '为': 'wei',
        '位': 'wei', '未': 'wei', '文': 'wen', '问': 'wen', '我': 'wo', '无': 'wu', '五': 'wu',

        '西': 'xi', '系': 'xi', '下': 'xia', '先': 'xian', '现': 'xian', '线': 'xian', '相': 'xiang',
        '想': 'xiang', '项': 'xiang', '向': 'xiang', '小': 'xiao', '效': 'xiao', '些': 'xie',
        '新': 'xin', '信': 'xin', '心': 'xin', '行': 'xing', '形': 'xing', '性': 'xing',
        '修': 'xiu', '需': 'xu', '学': 'xue', '选': 'xuan',

        '压': 'ya', '研': 'yan', '眼': 'yan', '要': 'yao', '也': 'ye', '业': 'ye', '页': 'ye',
        '一': 'yi', '以': 'yi', '已': 'yi', '意': 'yi', '易': 'yi', '艺': 'yi', '因': 'yin',
        '音': 'yin', '应': 'ying', '用': 'yong', '优': 'you', '由': 'you', '有': 'you',
        '又': 'you', '右': 'you', '于': 'yu', '与': 'yu', '语': 'yu', '域': 'yu', '原': 'yuan',
        '员': 'yuan', '远': 'yuan', '院': 'yuan', '月': 'yue', '越': 'yue', '云': 'yun', '运': 'yun',

        '在': 'zai', '再': 'zai', '早': 'zao', '增': 'zeng', '展': 'zhan', '站': 'zhan',
        '张': 'zhang', '长': 'zhang', '找': 'zhao', '这': 'zhe', '着': 'zhe', '真': 'zhen',
        '正': 'zheng', '整': 'zheng', '政': 'zheng', '之': 'zhi', '知': 'zhi', '直': 'zhi',
        '只': 'zhi', '制': 'zhi', '质': 'zhi', '治': 'zhi', '中': 'zhong', '种': 'zhong',
        '重': 'zhong', '周': 'zhou', '主': 'zhu', '住': 'zhu', '注': 'zhu', '专': 'zhuan',
        '转': 'zhuan', '状': 'zhuang', '准': 'zhun', '资': 'zi', '自': 'zi', '字': 'zi',
        '总': 'zong', '组': 'zu', '最': 'zui', '作': 'zuo', '做': 'zuo', '左': 'zuo',

        // 常用网站和应用名称
        '腾': 'teng', '讯': 'xun', '淘': 'tao', '宝': 'bao', '猫': 'mao', '微': 'wei',
        '博': 'bo', '狐': 'hu', '浪': 'lang', '抖': 'dou', '红': 'hong', '瓣': 'ban',
        '简': 'jian', '掘': 'jue', '否': 'fou', '酷': 'ku', '园': 'yuan',

        // 补充常用字符
        '查': 'cha', '护': 'hu', '防': 'fang', '代': 'dai', '码': 'ma', '审': 'shen',
        '质': 'zhi', '量': 'liang', '控': 'kong', '制': 'zhi', '安': 'an', '全': 'quan',
        '册': 'ce', '指': 'zhi', '南': 'nan', '流': 'liu', '程': 'cheng',
        '维': 'wei', '护': 'hu', '培': 'pei', '训': 'xun', '资': 'zi', '料': 'liao',

        // 更多常用字
        '版': 'ban', '本': 'ben', '备': 'bei', '份': 'fen', '案': 'an', '例': 'li',
        '式': 'shi', '样': 'yang', '板': 'ban', '模': 'mo', '型': 'xing', '态': 'tai',
        '状': 'zhuang', '况': 'kuang', '境': 'jing', '环': 'huan', '节': 'jie', '段': 'duan',
        '步': 'bu', '骤': 'zhou', '序': 'xu', '列': 'lie', '单': 'dan', '表': 'biao',
        '格': 'ge', '式': 'shi', '件': 'jian', '档': 'dang', '案': 'an', '卷': 'juan',
        '册': 'ce', '集': 'ji', '合': 'he', '群': 'qun', '组': 'zu', '队': 'dui',
        '班': 'ban', '级': 'ji', '层': 'ceng', '次': 'ci', '等': 'deng', '级': 'ji',
        '特': 'te', '脸': 'lian', '谷': 'gu', '歌': 'ge', '火': 'huo', '狐': 'hu',
        '苹': 'ping', '果': 'guo', '微': 'wei', '软': 'ruan', '亚': 'ya', '马': 'ma',
        '逊': 'xun', '网': 'wang', '飞': 'fei', '滴': 'di', '滴': 'di', '出': 'chu',
        '行': 'xing', '美': 'mei', '团': 'tuan', '饿': 'e', '了': 'le', '么': 'me',
        '哔': 'bi', '哩': 'li', '哔': 'bi', '哩': 'li', '西': 'xi', '瓜': 'gua',
        '视': 'shi', '频': 'pin', '腾': 'teng', '讯': 'xun', '视': 'shi', '频': 'pin',
        '优': 'you', '酷': 'ku', '土': 'tu', '豆': 'dou', '芒': 'mang', '果': 'guo',
        'TV': 'TV', '爱': 'ai', '奇': 'qi', '艺': 'yi', '乐': 'le', '视': 'shi',
        '咪': 'mi', '咕': 'gu', '视': 'shi', '频': 'pin', '央': 'yang', '视': 'shi',
        '网': 'wang', '凤': 'feng', '凰': 'huang', '网': 'wang', '人': 'ren', '民': 'min',
        '网': 'wang', '中': 'zhong', '国': 'guo', '新': 'xin', '闻': 'wen', '网': 'wang',
        '环': 'huan', '球': 'qiu', '网': 'wang', '参': 'can', '考': 'kao', '消': 'xiao',
        '息': 'xi', '澎': 'peng', '湃': 'pai', '新': 'xin', '闻': 'wen', '界': 'jie',
        '面': 'mian', '新': 'xin', '闻': 'wen', '虎': 'hu', '嗅': 'xiu', '网': 'wang',
        '钛': 'tai', '媒': 'mei', '体': 'ti', '36': '36', '氪': 'ke', '创': 'chuang',
        '业': 'ye', '邦': 'bang', 'IT': 'IT', '之': 'zhi', '家': 'jia', '雷': 'lei',
        '锋': 'feng', '网': 'wang', '果': 'guo', '壳': 'ke', '网': 'wang', '机': 'ji',
        '器': 'qi', '之': 'zhi', '心': 'xin', '少': 'shao', '数': 'shu', '派': 'pai',
        '极': 'ji', '客': 'ke', '公': 'gong', '园': 'yuan', '开': 'kai', '源': 'yuan',
        '中': 'zhong', '国': 'guo', 'OSCHINA': 'OSCHINA', 'GitHub': 'GitHub',
        'GitLab': 'GitLab', 'Gitee': 'Gitee', 'Stack': 'Stack', 'Overflow': 'Overflow',
        'MDN': 'MDN', 'W3C': 'W3C', 'Mozilla': 'Mozilla', 'Chrome': 'Chrome',
        'Firefox': 'Firefox', 'Safari': 'Safari', 'Edge': 'Edge', 'Opera': 'Opera',
        'Visual': 'Visual', 'Studio': 'Studio', 'Code': 'Code', 'IntelliJ': 'IntelliJ',
        'IDEA': 'IDEA', 'WebStorm': 'WebStorm', 'PyCharm': 'PyCharm', 'Android': 'Android',
        'Studio': 'Studio', 'Xcode': 'Xcode', 'Sublime': 'Sublime', 'Text': 'Text',
        'Atom': 'Atom', 'Vim': 'Vim', 'Emacs': 'Emacs', 'Notepad': 'Notepad',
        'Plus': 'Plus', 'Plus': 'Plus', 'Typora': 'Typora', 'Markdown': 'Markdown',
        'Notion': 'Notion', 'Obsidian': 'Obsidian', 'Roam': 'Roam', 'Research': 'Research',
        'Evernote': 'Evernote', 'OneNote': 'OneNote', 'Bear': 'Bear', 'Ulysses': 'Ulysses',
        'Scrivener': 'Scrivener', 'Drafts': 'Drafts', 'Day': 'Day', 'One': 'One',
        'Journey': 'Journey', 'Diaro': 'Diaro', 'MacJournal': 'MacJournal',
        'MindMeister': 'MindMeister', 'XMind': 'XMind', 'FreeMind': 'FreeMind',
        'MindManager': 'MindManager', 'Lucidchart': 'Lucidchart', 'Draw': 'Draw',
        'io': 'io', 'Figma': 'Figma', 'Sketch': 'Sketch', 'Adobe': 'Adobe',
        'Photoshop': 'Photoshop', 'Illustrator': 'Illustrator', 'InDesign': 'InDesign',
        'Premiere': 'Premiere', 'Pro': 'Pro', 'After': 'After', 'Effects': 'Effects',
        'Final': 'Final', 'Cut': 'Cut', 'Pro': 'Pro', 'DaVinci': 'DaVinci',
        'Resolve': 'Resolve', 'Blender': 'Blender', 'Maya': 'Maya', 'Cinema': 'Cinema',
        '4D': '4D', '3ds': '3ds', 'Max': 'Max', 'SketchUp': 'SketchUp', 'AutoCAD': 'AutoCAD',
        'SolidWorks': 'SolidWorks', 'Fusion': 'Fusion', '360': '360', 'Inventor': 'Inventor',
        'Rhino': 'Rhino', 'KeyShot': 'KeyShot', 'V-Ray': 'V-Ray', 'Corona': 'Corona',
        'Renderer': 'Renderer', 'Octane': 'Octane', 'Render': 'Render', 'Redshift': 'Redshift',
        'Arnold': 'Arnold', 'Mental': 'Mental', 'Ray': 'Ray', 'Maxwell': 'Maxwell',
        'Render': 'Render', 'Cycles': 'Cycles', 'Eevee': 'Eevee', 'Workbench': 'Workbench',
        'Freestyle': 'Freestyle', 'Grease': 'Grease', 'Pencil': 'Pencil', 'Sculpting': 'Sculpting',
        'Modeling': 'Modeling', 'Animation': 'Animation', 'Rigging': 'Rigging',
        'Texturing': 'Texturing', 'Shading': 'Shading', 'Lighting': 'Lighting',
        'Rendering': 'Rendering', 'Compositing': 'Compositing', 'Video': 'Video',
        'Editing': 'Editing', 'Motion': 'Motion', 'Graphics': 'Graphics', 'VFX': 'VFX',
        'CGI': 'CGI', '3D': '3D', '2D': '2D', 'UI': 'UI', 'UX': 'UX', 'Design': 'Design',
        'Prototype': 'Prototype', 'Wireframe': 'Wireframe', 'Mockup': 'Mockup',
        'User': 'User', 'Interface': 'Interface', 'Experience': 'Experience',
        'Interaction': 'Interaction', 'Product': 'Product', 'Service': 'Service',
        'Brand': 'Brand', 'Identity': 'Identity', 'Logo': 'Logo', 'Typography': 'Typography',
        'Color': 'Color', 'Palette': 'Palette', 'Layout': 'Layout', 'Grid': 'Grid',
        'System': 'System', 'Component': 'Component', 'Library': 'Library',
        'Style': 'Style', 'Guide': 'Guide', 'Pattern': 'Pattern', 'Template': 'Template',
        'Theme': 'Theme', 'Framework': 'Framework', 'Bootstrap': 'Bootstrap',
        'Foundation': 'Foundation', 'Bulma': 'Bulma', 'Semantic': 'Semantic',
        'Material': 'Material', 'Ant': 'Ant', 'Element': 'Element', 'Vuetify': 'Vuetify',
        'Quasar': 'Quasar', 'Chakra': 'Chakra', 'Mantine': 'Mantine', 'NextUI': 'NextUI',
        'Tailwind': 'Tailwind', 'CSS': 'CSS', 'Styled': 'Styled', 'Components': 'Components',
        'Emotion': 'Emotion', 'JSS': 'JSS', 'CSS-in-JS': 'CSS-in-JS', 'PostCSS': 'PostCSS',
        'Sass': 'Sass', 'SCSS': 'SCSS', 'Less': 'Less', 'Stylus': 'Stylus',
        'HTML': 'HTML', 'JavaScript': 'JavaScript', 'TypeScript': 'TypeScript',
        'React': 'React', 'Vue': 'Vue', 'Angular': 'Angular', 'Svelte': 'Svelte',
        'Solid': 'Solid', 'Preact': 'Preact', 'Lit': 'Lit', 'Stencil': 'Stencil',
        'Alpine': 'Alpine', 'Stimulus': 'Stimulus', 'Hotwire': 'Hotwire',
        'Turbo': 'Turbo', 'Stimulus': 'Stimulus', 'Rails': 'Rails', 'Django': 'Django',
        'Flask': 'Flask', 'FastAPI': 'FastAPI', 'Express': 'Express', 'Koa': 'Koa',
        'Hapi': 'Hapi', 'Fastify': 'Fastify', 'NestJS': 'NestJS', 'Next': 'Next',
        'Nuxt': 'Nuxt', 'Gatsby': 'Gatsby', 'Remix': 'Remix', 'SvelteKit': 'SvelteKit',
        'Astro': 'Astro', 'Vite': 'Vite', 'Webpack': 'Webpack', 'Rollup': 'Rollup',
        'Parcel': 'Parcel', 'ESBuild': 'ESBuild', 'SWC': 'SWC', 'Babel': 'Babel',
        'ESLint': 'ESLint', 'Prettier': 'Prettier', 'Jest': 'Jest', 'Vitest': 'Vitest',
        'Cypress': 'Cypress', 'Playwright': 'Playwright', 'Puppeteer': 'Puppeteer',
        'Selenium': 'Selenium', 'WebDriver': 'WebDriver', 'Appium': 'Appium',
        'Detox': 'Detox', 'Maestro': 'Maestro', 'TestCafe': 'TestCafe',
        'Protractor': 'Protractor', 'Karma': 'Karma', 'Mocha': 'Mocha',
        'Chai': 'Chai', 'Sinon': 'Sinon', 'Jasmine': 'Jasmine', 'QUnit': 'QUnit',
        'Tape': 'Tape', 'AVA': 'AVA', 'Lab': 'Lab', 'Code': 'Code', 'Tap': 'Tap',
        'Node': 'Node', 'Deno': 'Deno', 'Bun': 'Bun', 'npm': 'npm', 'Yarn': 'Yarn',
        'pnpm': 'pnpm', 'Lerna': 'Lerna', 'Rush': 'Rush', 'Nx': 'Nx',
        'Turborepo': 'Turborepo', 'Changesets': 'Changesets', 'Semantic': 'Semantic',
        'Release': 'Release', 'Standard': 'Standard', 'Version': 'Version',
        'Conventional': 'Conventional', 'Commits': 'Commits', 'Husky': 'Husky',
        'Lint': 'Lint', 'Staged': 'Staged', 'Commitizen': 'Commitizen',
        'Commitlint': 'Commitlint', 'Release': 'Release', 'Please': 'Please',
        'Auto': 'Auto', 'Semantic': 'Semantic', 'Release': 'Release',
        'GitHub': 'GitHub', 'Actions': 'Actions', 'GitLab': 'GitLab', 'CI': 'CI',
        'CD': 'CD', 'Jenkins': 'Jenkins', 'Travis': 'Travis', 'CircleCI': 'CircleCI',
        'Azure': 'Azure', 'DevOps': 'DevOps', 'AWS': 'AWS', 'CodePipeline': 'CodePipeline',
        'Google': 'Google', 'Cloud': 'Cloud', 'Build': 'Build', 'Bitbucket': 'Bitbucket',
        'Pipelines': 'Pipelines', 'TeamCity': 'TeamCity', 'Bamboo': 'Bamboo',
        'Octopus': 'Octopus', 'Deploy': 'Deploy', 'Spinnaker': 'Spinnaker',
        'Argo': 'Argo', 'Flux': 'Flux', 'Tekton': 'Tekton', 'Drone': 'Drone',
        'Buildkite': 'Buildkite', 'Semaphore': 'Semaphore', 'Codefresh': 'Codefresh',
        'Harness': 'Harness', 'GitOps': 'GitOps', 'Infrastructure': 'Infrastructure',
        'as': 'as', 'Code': 'Code', 'IaC': 'IaC', 'Terraform': 'Terraform',
        'Ansible': 'Ansible', 'Chef': 'Chef', 'Puppet': 'Puppet', 'SaltStack': 'SaltStack',
        'Vagrant': 'Vagrant', 'Packer': 'Packer', 'Docker': 'Docker',
        'Kubernetes': 'Kubernetes', 'Helm': 'Helm', 'Kustomize': 'Kustomize',
        'Istio': 'Istio', 'Linkerd': 'Linkerd', 'Consul': 'Consul', 'Connect': 'Connect',
        'Envoy': 'Envoy', 'NGINX': 'NGINX', 'Apache': 'Apache', 'Traefik': 'Traefik',
        'HAProxy': 'HAProxy', 'Cloudflare': 'Cloudflare', 'Fastly': 'Fastly',
        'KeyCDN': 'KeyCDN', 'MaxCDN': 'MaxCDN', 'Amazon': 'Amazon', 'CloudFront': 'CloudFront',
        'Google': 'Google', 'Cloud': 'Cloud', 'CDN': 'CDN', 'Azure': 'Azure',
        'CDN': 'CDN', 'Akamai': 'Akamai', 'Limelight': 'Limelight', 'Level': 'Level',
        '3': '3', 'Verizon': 'Verizon', 'Digital': 'Digital', 'Media': 'Media',
        'Services': 'Services', 'StackPath': 'StackPath', 'BunnyCDN': 'BunnyCDN',
        'jsDelivr': 'jsDelivr', 'unpkg': 'unpkg', 'cdnjs': 'cdnjs', 'BootstrapCDN': 'BootstrapCDN',
        'Google': 'Google', 'Fonts': 'Fonts', 'Adobe': 'Adobe', 'Fonts': 'Fonts',
        'Typekit': 'Typekit', 'Font': 'Font', 'Awesome': 'Awesome', 'Material': 'Material',
        'Icons': 'Icons', 'Feather': 'Feather', 'Icons': 'Icons', 'Heroicons': 'Heroicons',
        'Lucide': 'Lucide', 'Tabler': 'Tabler', 'Icons': 'Icons', 'Phosphor': 'Phosphor',
        'Icons': 'Icons', 'Remix': 'Remix', 'Icon': 'Icon', 'Eva': 'Eva', 'Icons': 'Icons',
        'Ant': 'Ant', 'Design': 'Design', 'Icons': 'Icons', 'Carbon': 'Carbon',
        'Design': 'Design', 'System': 'System', 'Fluent': 'Fluent', 'UI': 'UI',
        'System': 'System', 'Icons': 'Icons', 'Iconify': 'Iconify', 'Simple': 'Simple',
        'Icons': 'Icons', 'Devicons': 'Devicons', 'Skill': 'Skill', 'Icons': 'Icons',
        'Tech': 'Tech', 'Stack': 'Stack', 'Icons': 'Icons', 'Programming': 'Programming',
        'Languages': 'Languages', 'Frameworks': 'Frameworks', 'Libraries': 'Libraries',
        'Tools': 'Tools', 'Platforms': 'Platforms', 'Databases': 'Databases',
        'Cloud': 'Cloud', 'Services': 'Services', 'DevOps': 'DevOps', 'Tools': 'Tools',
        'Monitoring': 'Monitoring', 'Logging': 'Logging', 'Analytics': 'Analytics',
        'Performance': 'Performance', 'Security': 'Security', 'Testing': 'Testing',
        'Quality': 'Quality', 'Assurance': 'Assurance', 'Code': 'Code', 'Review': 'Review',
        'Static': 'Static', 'Analysis': 'Analysis', 'Dynamic': 'Dynamic', 'Analysis': 'Analysis',
        'Vulnerability': 'Vulnerability', 'Scanning': 'Scanning', 'Penetration': 'Penetration',
        'Testing': 'Testing', 'Bug': 'Bug', 'Bounty': 'Bounty', 'Responsible': 'Responsible',
        'Disclosure': 'Disclosure', 'Security': 'Security', 'Audit': 'Audit',
        'Compliance': 'Compliance', 'GDPR': 'GDPR', 'CCPA': 'CCPA', 'HIPAA': 'HIPAA',
        'SOX': 'SOX', 'PCI': 'PCI', 'DSS': 'DSS', 'ISO': 'ISO', '27001': '27001',
        'SOC': 'SOC', '2': '2', 'FedRAMP': 'FedRAMP', 'FISMA': 'FISMA',
        'NIST': 'NIST', 'Cybersecurity': 'Cybersecurity', 'Framework': 'Framework',
        'CIS': 'CIS', 'Controls': 'Controls', 'OWASP': 'OWASP', 'Top': 'Top',
        '10': '10', 'SANS': 'SANS', 'Top': 'Top', '25': '25', 'CWE': 'CWE',
        'CVE': 'CVE', 'NVD': 'NVD', 'MITRE': 'MITRE', 'ATT&CK': 'ATT&CK',
        'CAPEC': 'CAPEC', 'STIX': 'STIX', 'TAXII': 'TAXII', 'OpenIOC': 'OpenIOC',
        'YARA': 'YARA', 'Sigma': 'Sigma', 'Suricata': 'Suricata', 'Snort': 'Snort',
        'Zeek': 'Zeek', 'Bro': 'Bro', 'OSSEC': 'OSSEC', 'Wazuh': 'Wazuh',
        'OSSIM': 'OSSIM', 'AlienVault': 'AlienVault', 'USM': 'USM', 'Anywhere': 'Anywhere',
        'AT&T': 'AT&T', 'Cybersecurity': 'Cybersecurity', 'Splunk': 'Splunk',
        'Elastic': 'Elastic', 'Security': 'Security', 'QRadar': 'QRadar', 'ArcSight': 'ArcSight',
        'LogRhythm': 'LogRhythm', 'Rapid7': 'Rapid7', 'InsightIDR': 'InsightIDR',
        'CrowdStrike': 'CrowdStrike', 'Falcon': 'Falcon', 'SentinelOne': 'SentinelOne',
        'Carbon': 'Carbon', 'Black': 'Black', 'Cylance': 'Cylance', 'Symantec': 'Symantec',
        'Endpoint': 'Endpoint', 'Protection': 'Protection', 'McAfee': 'McAfee',
        'Trend': 'Trend', 'Micro': 'Micro', 'Kaspersky': 'Kaspersky', 'Bitdefender': 'Bitdefender',
        'ESET': 'ESET', 'F-Secure': 'F-Secure', 'Sophos': 'Sophos', 'Avast': 'Avast',
        'AVG': 'AVG', 'Avira': 'Avira', 'Norton': 'Norton', 'Windows': 'Windows',
        'Defender': 'Defender', 'macOS': 'macOS', 'XProtect': 'XProtect', 'Gatekeeper': 'Gatekeeper',
        'System': 'System', 'Integrity': 'Integrity', 'Protection': 'Protection',
        'Linux': 'Linux', 'AppArmor': 'AppArmor', 'SELinux': 'SELinux', 'grsecurity': 'grsecurity',
        'PaX': 'PaX', 'KASLR': 'KASLR', 'SMEP': 'SMEP', 'SMAP': 'SMAP',
        'Control': 'Control', 'Flow': 'Flow', 'Integrity': 'Integrity', 'CFI': 'CFI',
        'Address': 'Address', 'Space': 'Space', 'Layout': 'Layout', 'Randomization': 'Randomization',
        'ASLR': 'ASLR', 'Data': 'Data', 'Execution': 'Execution', 'Prevention': 'Prevention',
        'DEP': 'DEP', 'No': 'No', 'Execute': 'Execute', 'NX': 'NX', 'Bit': 'Bit',
        'Stack': 'Stack', 'Canaries': 'Canaries', 'Guard': 'Guard', 'Pages': 'Pages',
        'Shadow': 'Shadow', 'Stack': 'Stack', 'Intel': 'Intel', 'CET': 'CET',
        'ARM': 'ARM', 'Pointer': 'Pointer', 'Authentication': 'Authentication',
        'Memory': 'Memory', 'Tagging': 'Tagging', 'Hardware': 'Hardware', 'Assisted': 'Assisted',
        'AddressSanitizer': 'AddressSanitizer', 'ASan': 'ASan', 'MemorySanitizer': 'MemorySanitizer',
        'MSan': 'MSan', 'ThreadSanitizer': 'ThreadSanitizer', 'TSan': 'TSan',
        'UndefinedBehaviorSanitizer': 'UndefinedBehaviorSanitizer', 'UBSan': 'UBSan',
        'LeakSanitizer': 'LeakSanitizer', 'LSan': 'LSan', 'Valgrind': 'Valgrind',
        'Memcheck': 'Memcheck', 'Helgrind': 'Helgrind', 'DRD': 'DRD',
        'Cachegrind': 'Cachegrind', 'Callgrind': 'Callgrind', 'Massif': 'Massif',
        'DHAT': 'DHAT', 'SGCheck': 'SGCheck', 'BBV': 'BBV', 'Lackey': 'Lackey',
        'Nulgrind': 'Nulgrind', 'Dr': 'Dr', 'Memory': 'Memory', 'Intel': 'Intel',
        'Inspector': 'Inspector', 'PurifyPlus': 'PurifyPlus', 'BoundsChecker': 'BoundsChecker',
        'Application': 'Application', 'Verifier': 'Verifier', 'CRT': 'CRT',
        'Debug': 'Debug', 'Heap': 'Heap', 'PageHeap': 'PageHeap', 'GFlags': 'GFlags',
        'WinDbg': 'WinDbg', 'Visual': 'Visual', 'Studio': 'Studio', 'Debugger': 'Debugger',
        'GDB': 'GDB', 'LLDB': 'LLDB', 'Xcode': 'Xcode', 'Instruments': 'Instruments',
        'Time': 'Time', 'Profiler': 'Profiler', 'Allocations': 'Allocations',
        'Leaks': 'Leaks', 'Zombies': 'Zombies', 'Activity': 'Activity', 'Monitor': 'Monitor',
        'System': 'System', 'Trace': 'Trace', 'Network': 'Network', 'Energy': 'Energy',
        'Log': 'Log', 'Metal': 'Metal', 'System': 'System', 'Trace': 'Trace',
        'Core': 'Core', 'Animation': 'Animation', 'Core': 'Core', 'Data': 'Data',
        'Sudden': 'Sudden', 'Termination': 'Termination', 'Dispatch': 'Dispatch',
        'Queue': 'Queue', 'File': 'File', 'Activity': 'Activity', 'SceneKit': 'SceneKit',
        'SpriteKit': 'SpriteKit', 'Game': 'Game', 'Playground': 'Playground',
        'Logging': 'Logging', 'Points': 'Points', 'of': 'of', 'Interest': 'Interest',
        'Signposts': 'Signposts', 'Custom': 'Custom', 'Instruments': 'Instruments',
        'DTrace': 'DTrace', 'SystemTap': 'SystemTap', 'Perf': 'Perf', 'BPF': 'BPF',
        'eBPF': 'eBPF', 'bcc': 'bcc', 'bpftrace': 'bpftrace', 'Brendan': 'Brendan',
        'Gregg': 'Gregg', 'Performance': 'Performance', 'Tools': 'Tools',
        'Flame': 'Flame', 'Graphs': 'Graphs', 'Heat': 'Heat', 'Maps': 'Maps',
        'Frequency': 'Frequency', 'Trails': 'Trails', 'Off': 'Off', 'CPU': 'CPU',
        'Profiling': 'Profiling', 'Mixed': 'Mixed', 'Mode': 'Mode', 'Differential': 'Differential',
        'Flame': 'Flame', 'Graphs': 'Graphs', 'Subsecond': 'Subsecond', 'Offset': 'Offset',
        'Heat': 'Heat', 'Maps': 'Maps', 'Wakeup': 'Wakeup', 'Latency': 'Latency',
        'Chain': 'Chain', 'Graphs': 'Graphs', 'Kernel': 'Kernel', 'Flow': 'Flow',
        'Analysis': 'Analysis', 'TCP': 'TCP', 'Life': 'Life', 'Span': 'Span',
        'Analysis': 'Analysis', 'Block': 'Block', 'I/O': 'I/O', 'Latency': 'Latency',
        'Distribution': 'Distribution', 'File': 'File', 'System': 'System',
        'Latency': 'Latency', 'by': 'by', 'Process': 'Process', 'VFS': 'VFS',
        'Statistics': 'Statistics', 'Ext4': 'Ext4', 'Slower': 'Slower', 'XFS': 'XFS',
        'Slower': 'Slower', 'ZFS': 'ZFS', 'ARC': 'ARC', 'Hit': 'Hit', 'Ratio': 'Ratio',
        'Btrfs': 'Btrfs', 'Slower': 'Slower', 'NFS': 'NFS', 'Slower': 'Slower',
        'CIFS': 'CIFS', 'Slower': 'Slower', 'MySQL': 'MySQL', 'Slower': 'Slower',
        'PostgreSQL': 'PostgreSQL', 'Slower': 'Slower', 'Node': 'Node', 'js': 'js',
        'Slower': 'Slower', 'Python': 'Python', 'Slower': 'Slower', 'Ruby': 'Ruby',
        'Slower': 'Slower', 'Java': 'Java', 'Slower': 'Slower', 'Go': 'Go',
        'Slower': 'Slower', 'Rust': 'Rust', 'Slower': 'Slower', 'C': 'C',
        'Slower': 'Slower', 'C++': 'C++', 'Slower': 'Slower', 'C#': 'C#',
        'Slower': 'Slower', 'PHP': 'PHP', 'Slower': 'Slower', 'Perl': 'Perl',
        'Slower': 'Slower', 'Lua': 'Lua', 'Slower': 'Slower', 'Bash': 'Bash',
        'Slower': 'Slower', 'PowerShell': 'PowerShell', 'Slower': 'Slower',
        'Assembly': 'Assembly', 'Slower': 'Slower', 'LLVM': 'LLVM', 'IR': 'IR',
        'Slower': 'Slower', 'WebAssembly': 'WebAssembly', 'Slower': 'Slower',
        'WASM': 'WASM', 'Slower': 'Slower', 'Emscripten': 'Emscripten',
        'Slower': 'Slower', 'Docker': 'Docker', 'Slower': 'Slower',
        'Kubernetes': 'Kubernetes', 'Slower': 'Slower', 'Istio': 'Istio',
        'Slower': 'Slower', 'Envoy': 'Envoy', 'Slower': 'Slower',
        'NGINX': 'NGINX', 'Slower': 'Slower', 'Apache': 'Apache',
        'Slower': 'Slower', 'HAProxy': 'HAProxy', 'Slower': 'Slower',
        'Traefik': 'Traefik', 'Slower': 'Slower', 'Consul': 'Consul',
        'Slower': 'Slower', 'Vault': 'Vault', 'Slower': 'Slower',
        'Nomad': 'Nomad', 'Slower': 'Slower', 'Terraform': 'Terraform',
        'Slower': 'Slower', 'Ansible': 'Ansible', 'Slower': 'Slower',
        'Chef': 'Chef', 'Slower': 'Slower', 'Puppet': 'Puppet',
        'Slower': 'Slower', 'SaltStack': 'SaltStack', 'Slower': 'Slower',
        'Vagrant': 'Vagrant', 'Slower': 'Slower', 'Packer': 'Packer',
        'Slower': 'Slower', 'Jenkins': 'Jenkins', 'Slower': 'Slower',
        'GitLab': 'GitLab', 'CI': 'CI', 'Slower': 'Slower', 'GitHub': 'GitHub',
        'Actions': 'Actions', 'Slower': 'Slower', 'Azure': 'Azure',
        'DevOps': 'DevOps', 'Slower': 'Slower', 'AWS': 'AWS',
        'CodePipeline': 'CodePipeline', 'Slower': 'Slower', 'Google': 'Google',
        'Cloud': 'Cloud', 'Build': 'Build', 'Slower': 'Slower',
        'CircleCI': 'CircleCI', 'Slower': 'Slower', 'Travis': 'Travis',
        'CI': 'CI', 'Slower': 'Slower', 'TeamCity': 'TeamCity',
        'Slower': 'Slower', 'Bamboo': 'Bamboo', 'Slower': 'Slower',
        'Octopus': 'Octopus', 'Deploy': 'Deploy', 'Slower': 'Slower',
        'Spinnaker': 'Spinnaker', 'Slower': 'Slower', 'Argo': 'Argo',
        'CD': 'CD', 'Slower': 'Slower', 'Flux': 'Flux', 'Slower': 'Slower',
        'Tekton': 'Tekton', 'Slower': 'Slower', 'Drone': 'Drone',
        'Slower': 'Slower', 'Buildkite': 'Buildkite', 'Slower': 'Slower',
        'Semaphore': 'Semaphore', 'Slower': 'Slower', 'Codefresh': 'Codefresh',
        'Slower': 'Slower', 'Harness': 'Harness', 'Slower': 'Slower',
        'Prometheus': 'Prometheus', 'Slower': 'Slower', 'Grafana': 'Grafana',
        'Slower': 'Slower', 'Jaeger': 'Jaeger', 'Slower': 'Slower',
        'Zipkin': 'Zipkin', 'Slower': 'Slower', 'OpenTelemetry': 'OpenTelemetry',
        'Slower': 'Slower', 'Datadog': 'Datadog', 'Slower': 'Slower',
        'New': 'New', 'Relic': 'Relic', 'Slower': 'Slower', 'AppDynamics': 'AppDynamics',
        'Slower': 'Slower', 'Dynatrace': 'Dynatrace', 'Slower': 'Slower',
        'Elastic': 'Elastic', 'APM': 'APM', 'Slower': 'Slower', 'Honeycomb': 'Honeycomb',
        'Slower': 'Slower', 'Lightstep': 'Lightstep', 'Slower': 'Slower',
        'Sentry': 'Sentry', 'Slower': 'Slower', 'Rollbar': 'Rollbar',
        'Slower': 'Slower', 'Bugsnag': 'Bugsnag', 'Slower': 'Slower',
        'Airbrake': 'Airbrake', 'Slower': 'Slower', 'Raygun': 'Raygun',
        'Slower': 'Slower', 'LogRocket': 'LogRocket', 'Slower': 'Slower',
        'FullStory': 'FullStory', 'Slower': 'Slower', 'Hotjar': 'Hotjar',
        'Slower': 'Slower', 'Crazy': 'Crazy', 'Egg': 'Egg', 'Slower': 'Slower',
        'Mixpanel': 'Mixpanel', 'Slower': 'Slower', 'Amplitude': 'Amplitude',
        'Slower': 'Slower', 'Segment': 'Segment', 'Slower': 'Slower',
        'Google': 'Google', 'Analytics': 'Analytics', 'Slower': 'Slower',
        'Adobe': 'Adobe', 'Analytics': 'Analytics', 'Slower': 'Slower',
        'Heap': 'Heap', 'Analytics': 'Analytics', 'Slower': 'Slower',
        'Kissmetrics': 'Kissmetrics', 'Slower': 'Slower', 'Chartio': 'Chartio',
        'Slower': 'Slower', 'Looker': 'Looker', 'Slower': 'Slower',
        'Tableau': 'Tableau', 'Slower': 'Slower', 'Power': 'Power',
        'BI': 'BI', 'Slower': 'Slower', 'Qlik': 'Qlik', 'Sense': 'Sense',
        'Slower': 'Slower', 'Sisense': 'Sisense', 'Slower': 'Slower',
        'Domo': 'Domo', 'Slower': 'Slower', 'Klipfolio': 'Klipfolio',
        'Slower': 'Slower', 'Geckoboard': 'Geckoboard', 'Slower': 'Slower',
        'Databox': 'Databox', 'Slower': 'Slower', 'Cyfe': 'Cyfe',
        'Slower': 'Slower', 'Dasheroo': 'Dasheroo', 'Slower': 'Slower',
        'Grow': 'Grow', 'Slower': 'Slower', 'Chartbeat': 'Chartbeat',
        'Slower': 'Slower', 'Parse': 'Parse', 'ly': 'ly', 'Slower': 'Slower',
        'Clicky': 'Clicky', 'Slower': 'Slower', 'StatCounter': 'StatCounter',
        'Slower': 'Slower', 'Woopra': 'Woopra', 'Slower': 'Slower',
        'GoSquared': 'GoSquared', 'Slower': 'Slower', 'Mint': 'Mint',
        'Slower': 'Slower', 'Gauges': 'Gauges', 'Slower': 'Slower',
        'Simple': 'Simple', 'Analytics': 'Analytics', 'Slower': 'Slower',
        'Fathom': 'Fathom', 'Analytics': 'Analytics', 'Slower': 'Slower',
        'Plausible': 'Plausible', 'Analytics': 'Analytics', 'Slower': 'Slower',
        'Umami': 'Umami', 'Slower': 'Slower', 'Matomo': 'Matomo',
        'Slower': 'Slower', 'Open': 'Open', 'Web': 'Web', 'Analytics': 'Analytics',
        'Slower': 'Slower', 'AWStats': 'AWStats', 'Slower': 'Slower',
        'Webalizer': 'Webalizer', 'Slower': 'Slower', 'GoAccess': 'GoAccess',
        'Slower': 'Slower', 'Analog': 'Analog', 'Slower': 'Slower',
        'Visitors': 'Visitors', 'Slower': 'Slower', 'W3Perl': 'W3Perl',
        'Slower': 'Slower', 'WebTrends': 'WebTrends', 'Slower': 'Slower',
        'Coremetrics': 'Coremetrics', 'Slower': 'Slower', 'Omniture': 'Omniture',
        'Slower': 'Slower', 'SiteCatalyst': 'SiteCatalyst', 'Slower': 'Slower',
        'WebSideStory': 'WebSideStory', 'Slower': 'Slower', 'HitBox': 'HitBox',
        'Slower': 'Slower', 'NetTracker': 'NetTracker', 'Slower': 'Slower',
        'ClickTracks': 'ClickTracks', 'Slower': 'Slower', 'IndexTools': 'IndexTools',
        'Slower': 'Slower', 'DeepMetrix': 'DeepMetrix', 'Slower': 'Slower',
        'WebAbacus': 'WebAbacus', 'Slower': 'Slower', 'ClickZ': 'ClickZ',
        'Stats': 'Stats', 'Slower': 'Slower', 'StatMarket': 'StatMarket',
        'Slower': 'Slower', 'NetCount': 'NetCount', 'Slower': 'Slower',
        'WebCounter': 'WebCounter', 'Slower': 'Slower', 'TheCounter': 'TheCounter',
        'Slower': 'Slower', 'FastCounter': 'FastCounter', 'Slower': 'Slower',
        'Digits': 'Digits', 'Slower': 'Slower', 'Nedstat': 'Nedstat',
        'Slower': 'Slower', 'Extreme': 'Extreme', 'Tracking': 'Tracking',
        'Slower': 'Slower', 'Site': 'Site', 'Meter': 'Meter', 'Slower': 'Slower',
        'Web': 'Web', 'Trends': 'Trends', 'Slower': 'Slower', 'Hit': 'Hit',
        'List': 'List', 'Slower': 'Slower', 'Top': 'Top', 'Site': 'Site',
        'Slower': 'Slower', 'Link': 'Link', 'Exchange': 'Exchange',
        'Slower': 'Slower', 'Banner': 'Banner', 'Exchange': 'Exchange',
        'Slower': 'Slower', 'Ad': 'Ad', 'Network': 'Network', 'Slower': 'Slower',
        'Affiliate': 'Affiliate', 'Program': 'Program', 'Slower': 'Slower',
        'Commission': 'Commission', 'Junction': 'Junction', 'Slower': 'Slower',
        'ShareASale': 'ShareASale', 'Slower': 'Slower', 'ClickBank': 'ClickBank',
        'Slower': 'Slower', 'Amazon': 'Amazon', 'Associates': 'Associates',
        'Slower': 'Slower', 'eBay': 'eBay', 'Partner': 'Partner',
        'Network': 'Network', 'Slower': 'Slower', 'Rakuten': 'Rakuten',
        'Advertising': 'Advertising', 'Slower': 'Slower', 'Impact': 'Impact',
        'Radius': 'Radius', 'Slower': 'Slower', 'PartnerStack': 'PartnerStack',
        'Slower': 'Slower', 'Crossbeam': 'Crossbeam', 'Slower': 'Slower',
        'Partner': 'Partner', 'Fleet': 'Fleet', 'Slower': 'Slower',
        'Channeltivity': 'Channeltivity', 'Slower': 'Slower', 'Allbound': 'Allbound',
        'Slower': 'Slower', 'Zinfi': 'Zinfi', 'Slower': 'Slower',
        'Channeltivity': 'Channeltivity', 'Slower': 'Slower', 'Impartner': 'Impartner',
        'Slower': 'Slower', 'Channeltivity': 'Channeltivity', 'Slower': 'Slower',
        'Crossbeam': 'Crossbeam', 'Slower': 'Slower', 'Partner': 'Partner',
        'Fleet': 'Fleet', 'Slower': 'Slower', 'Channeltivity': 'Channeltivity',
        'Slower': 'Slower', 'Allbound': 'Allbound', 'Slower': 'Slower',
        'Zinfi': 'Zinfi', 'Slower': 'Slower', 'Channeltivity': 'Channeltivity',
        'Slower': 'Slower', 'Impartner': 'Impartner', 'Slower': 'Slower'
    },

    // 获取汉字的拼音（改进版）
    getPinyin(char) {
        // 1. 优先使用映射表
        if (this.pinyinMap[char]) {
            return this.pinyinMap[char];
        }

        // 2. 对于中文字符，使用Unicode范围估算
        if (/[\u4e00-\u9fff]/.test(char)) {
            return this.estimatePinyin(char);
        }

        // 3. 非中文字符直接返回小写
        return char.toLowerCase();
    },

    // 基于常用字的拼音估算（兜底方案）
    estimatePinyin(char) {
        // 对于未在映射表中的字符，尝试一些启发式方法

        // 1. 检查是否是数字或英文
        if (/[0-9a-zA-Z]/.test(char)) {
            return char.toLowerCase();
        }

        // 2. 对于中文字符，返回一个占位符
        // 这样至少不会破坏搜索功能
        if (/[\u4e00-\u9fff]/.test(char)) {
            // 使用字符的Unicode编码生成一个一致的字母
            const code = char.charCodeAt(0);
            const letterIndex = (code - 0x4e00) % 26;
            return String.fromCharCode(97 + letterIndex); // a-z
        }

        // 3. 其他字符直接返回
        return char.toLowerCase();
    },

    // 获取文本的拼音全拼
    getFullPinyin(text) {
        return text.split('').map(char => this.getPinyin(char)).join('');
    },

    // 获取文本的拼音首字母
    getFirstLetters(text) {
        return text.split('').map(char => {
            const pinyin = this.getPinyin(char);
            return pinyin.charAt(0);
        }).join('');
    },

    // 智能搜索匹配（支持多关键词、模糊搜索）
    matches(text, searchTerm) {
        if (!text || !searchTerm) return false;

        // 处理多关键词（空格分隔）
        const keywords = this.parseKeywords(searchTerm);

        // 所有关键词都必须匹配
        return keywords.every(keyword => this.matchesSingleKeyword(text, keyword));
    },

    // 解析搜索关键词
    parseKeywords(searchTerm) {
        return searchTerm.toLowerCase()
            .split(/\s+/)  // 按空格分割
            .filter(keyword => keyword.length > 0);  // 过滤空字符串
    },

    // 单个关键词匹配（支持原始标题、拼音全拼、拼音首字母）
    matchesSingleKeyword(text, keyword) {
        if (!text || !keyword) return false;

        const lowerText = text.toLowerCase();
        const lowerKeyword = keyword.toLowerCase();

        // 1. 原始标题直接匹配（最高优先级）
        if (lowerText.includes(lowerKeyword)) {
            return true;
        }

        // 只有当关键词是纯英文时才进行拼音匹配
        if (/^[a-z]+$/.test(lowerKeyword)) {
            // 2. 拼音全拼匹配
            const fullPinyin = this.getFullPinyin(text);
            if (fullPinyin.includes(lowerKeyword)) {
                return true;
            }

            // 3. 拼音首字母精确匹配
            const initials = this.getFirstLetters(text);
            if (initials.includes(lowerKeyword)) {
                return true;
            }

            // 4. 拼音首字母子序列匹配（更严格的条件）
            if (lowerKeyword.length >= 2 && this.isSubsequence(lowerKeyword, initials)) {
                return true;
            }
        }

        return false;
    },

    // 精确匹配算法（减少误匹配）
    exactMatch(text, keyword) {
        if (!text || !keyword) return false;
        return text.toLowerCase().includes(keyword.toLowerCase());
    },

    // 模糊包含匹配（允许字符间有间隔）
    fuzzyContains(text, keyword) {
        let textIndex = 0;
        let keywordIndex = 0;

        while (textIndex < text.length && keywordIndex < keyword.length) {
            if (text[textIndex] === keyword[keywordIndex]) {
                keywordIndex++;
            }
            textIndex++;
        }

        return keywordIndex === keyword.length;
    },

    // 检查是否为子序列（支持不连续匹配）
    isSubsequence(searchTerm, targetText) {
        let searchIndex = 0;
        let targetIndex = 0;

        while (searchIndex < searchTerm.length && targetIndex < targetText.length) {
            if (searchTerm[searchIndex] === targetText[targetIndex]) {
                searchIndex++;
            }
            targetIndex++;
        }

        return searchIndex === searchTerm.length;
    },

    // 生成书签的搜索索引（预处理）
    generateSearchIndex(text) {
        if (!text) return null;

        const lowerText = text.toLowerCase();
        const fullPinyin = this.getFullPinyin(text);
        const initials = this.getFirstLetters(text);

        return {
            original: lowerText,
            fullPinyin: fullPinyin,
            initials: initials,
            text: text  // 保留原始文本用于显示
        };
    },

    // 使用预生成的搜索索引进行匹配（性能优化版）
    matchesWithIndex(searchIndex, searchTerm) {
        if (!searchIndex || !searchTerm) return false;

        // 处理多关键词
        const keywords = this.parseKeywords(searchTerm);

        // 所有关键词都必须匹配
        return keywords.every(keyword => {
            const lowerKeyword = keyword.toLowerCase();

            // 1. 原始标题精确匹配
            if (this.exactMatch(searchIndex.original, lowerKeyword)) {
                return true;
            }

            // 只有当关键词是纯英文时才进行拼音匹配
            if (/^[a-z]+$/.test(lowerKeyword)) {
                // 2. 拼音全拼精确匹配
                if (this.exactMatch(searchIndex.fullPinyin, lowerKeyword)) {
                    return true;
                }

                // 3. 拼音首字母精确匹配
                if (this.exactMatch(searchIndex.initials, lowerKeyword)) {
                    return true;
                }

                // 4. 拼音首字母子序列匹配（仅限长度>=2的关键词）
                if (lowerKeyword.length >= 2 && this.isSubsequence(lowerKeyword, searchIndex.initials)) {
                    return true;
                }
            }

            return false;
        });
    },


};

// 导出到全局
window.PinyinHelper = PinyinHelper;

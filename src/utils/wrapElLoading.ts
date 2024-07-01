import { ElLoading } from 'element-plus'

export default {
  install(app: any) {
    const svg: string = '<svg width="50" height="50" viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg">\n' +
      '    <rect y="10" width="15" height="120" rx="6" fill="#376ad0">\n' +
      '        <animate attributeName="height"\n' +
      '             begin="0.5s" dur="1s"\n' +
      '             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '        <animate attributeName="y"\n' +
      '             begin="0.5s" dur="1s"\n' +
      '             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '    </rect>\n' +
      '    <rect x="30" y="10" width="15" height="120" rx="6" fill="#62b7e2">\n' +
      '        <animate attributeName="height"\n' +
      '             begin="0.25s" dur="1s"\n' +
      '             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '        <animate attributeName="y"\n' +
      '             begin="0.25s" dur="1s"\n' +
      '             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '    </rect>\n' +
      '    <rect x="60" width="15" height="140" rx="6" fill="#c4ebf7">\n' +
      '        <animate attributeName="height"\n' +
      '             begin="0s" dur="1s"\n' +
      '             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '        <animate attributeName="y"\n' +
      '             begin="0s" dur="1s"\n' +
      '             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '    </rect>\n' +
      '    <rect x="90" y="10" width="15" height="120" rx="6" fill="#62b7e2">\n' +
      '        <animate attributeName="height"\n' +
      '             begin="0.25s" dur="1s"\n' +
      '             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '        <animate attributeName="y"\n' +
      '             begin="0.25s" dur="1s"\n' +
      '             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '    </rect>\n' +
      '    <rect x="120" y="10" width="15" height="120" rx="6" fill="#376ad0">\n' +
      '        <animate attributeName="height"\n' +
      '             begin="0.5s" dur="1s"\n' +
      '             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '        <animate attributeName="y"\n' +
      '             begin="0.5s" dur="1s"\n' +
      '             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"\n' +
      '             repeatCount="indefinite" />\n' +
      '    </rect>\n' +
      '</svg>'
    const loadingDir: any = ElLoading.directive
    const originDirMounted = loadingDir.mounted
    loadingDir.mounted = function(el: any, binding: any, vnode: any, prevVnode: any) {
      el.setAttribute('element-loading-svg', svg)
      originDirMounted.call(this, el, binding, vnode, prevVnode)
    }
    const originService = ElLoading.service
    ElLoading.service = function(options: any) {
      return originService.call(this, Object.assign({ svg }, options))
    }
    app.config.globalProperties.$loading = ElLoading.service
    app.use(ElLoading)
  }
}

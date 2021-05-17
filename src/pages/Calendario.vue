<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="calendario"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="90%"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <calendariocomponent :imprimir="true"></calendariocomponent>
      </section>
    </vue-html2pdf>
    <calendariocomponent
      :imprimir="false"
      @downloadPdf="downloadPdf()"
    ></calendariocomponent>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
//import * as html2pdf from "html2pdf.js";
import calendariocomponent from "../components/Calendiariocomponent"; // ui is aliased from '@quasar/quasar-ui-qcalendar'
export default {
  name: "Calendario",
  components: { calendariocomponent, VueHtml2pdf },
  data() {
    return {
      isGenerating: false,
      contentRendered: false,
      progress: 0,
      generatingPdf: false,
      pdfDownloaded: false
    };
  },
  methods: {
    async downloadPdf() {
      this.$refs.html2Pdf.generatePdf();
    }
  }
};
</script>
<style scoped>
.vistacalendario {
  background: black;
}
</style>

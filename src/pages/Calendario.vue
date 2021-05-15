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
      pdf-content-width="100%"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <calendariocomponent></calendariocomponent>
      </section>
    </vue-html2pdf>
    <calendariocomponent @downloadPdf="downloadPdf()"></calendariocomponent>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
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
    },
    onProgress(progress) {
      this.progress = progress;
    },
    startPagination() {},
    hasPaginated() {},
    async beforeDownload({ html2pdf, options, pdfContent }) {},
    hasDownloaded(blobPdf) {
      this.pdfDownloaded = true;
      console.log(blobPdf);
    },
    domRendered() {
      this.contentRendered = true;
    },
    onBlobGenerate(blob) {}
  }
};
</script>
<style scoped>
.vistacalendario {
  background: black;
}
</style>

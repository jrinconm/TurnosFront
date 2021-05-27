<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div>
    <calendariocomponent
      id="calendario"
      imprimir="true"
      @downloadPdf="downloadPdf()"
    ></calendariocomponent>
  </div>
</template>

<script>
//import VueHtml2pdf from "vue-html2pdf";
import * as html2pdf from "html2pdf.js";
import calendariocomponent from "../components/Calendiariocomponent"; // ui is aliased from '@quasar/quasar-ui-qcalendar'
export default {
  name: "Calendario",
  components: { calendariocomponent },
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
    downloadPdf() {
      var element = document.getElementById("calendario");
      var opt = {
        margin: 1,
        filename: "calendario.pdf",
        image: { type: "jpeg", quality: 0.98 },
        jsPDF: { orientation: "landscape" }
      };
      html2pdf()
        .set(opt)
        .from(element)
        .save();
      //html2pdf(element, opt);
      //this.$refs.html2Pdf.generatePdf();
    }
  }
};
</script>
<style scoped></style>

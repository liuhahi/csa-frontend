<template>
  <div :id="props.id" class="diff-editor-style"></div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, computed, watch } from "vue";
import * as monaco from "monaco-editor";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  original: {
    type: String,
    default: "",
  },
  modified: {
    type: String,
    default: "",
  },
  boxHeight: {
    type: String,
    default: "200px",
  },
  lineNumbersMinChars: {
    type: Number,
    default: 5,
  },
  language: {
    type: String,
    default: "javascript",
  },
  wordWrap: {
    type: String,
    default: "off",
  },
  startLineNumber: {
    type: Number,
    default: 0,
  },
  highlightRange: {
    type: Object,
    default: () => {},
  },
  className: {
    type: String,
    default: "myContentClass",
  },
});

let editor;

let startLine = 0;
let endLine = 0;
let threshold = 0;
const startOffset = 5;

const originalModel = monaco.editor.createModel(props.original, props.language);
const modifiedModel = monaco.editor.createModel(props.modified, props.language);

function displayStart(lineNumber) {
  if (props.startLineNumber == 0) {
    return lineNumber;
  }
  let result = lineNumber + props.startLineNumber - startOffset;
  if (result < 1 && threshold == 0) {
    threshold = 0 - result + 1;
  }
  return result + threshold;
}

function computedStart(start) {
  let result = start + 1 - startOffset;
  return result < 0 ? 0 : result;
}

function computedEnd(end) {
  let result = end + startOffset;
  return result;
}

onMounted(() => {
  try {
    editor = monaco.editor.createDiffEditor(document.getElementById(props.id), {
      originalEditable: false,
      readOnly: true,
      smoothScrolling: true,
      theme: "vs",
      lineNumbersMinChars: props.lineNumbersMinChars,
      automaticLayout: true,
      // lineNumbers: (lineNumber) => {
      //   return displayStart(lineNumber).toString();
      // },
      scrollbar: {
        vertical: "hidden", // Set the scrollbar option to none
        alwaysConsumeMouseWheel: false,
      },
      fontSize: 12,
      // renderLineHighlight: "all",
      glyphMargin: true,
      minimap: {
        enabled: false,
      },
      contextmenu: false,
      scrollBeyondLastLine: false,
      overviewRulerLanes: 0,
    });
    editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  } catch (error) {
    console.log("error", error);
  }
});

onBeforeUnmount(() => {
  editor.dispose();
});

const containerHeight = computed(() => {
  if (props.boxHeight) {
    return props.boxHeight;
  }
  return "200px";
});

watch(
  () => props.highlightRange,
  (newVal, oldVal) => {
    if (newVal != oldVal && oldVal != undefined) {
      console.log("lines: oldVal", oldVal);
      console.log("lines: revealLines", originalModel);
      // reset model, It is safe to call setModel(null) to simply detach the current model from the editor.
      editor.setModel(null);
      editor.setModel({
        original: originalModel,
        modified: modifiedModel,
      });
      setTimeout(function () {
        editor.revealLines(
          newVal.modified.startLineNumber,
          newVal.modified.endLineNumber,
          monaco.editor.ScrollType.Smooth,
        );
        editor.createDecorationsCollection([
          {
            range: new monaco.Range(
              newVal.modified.startLineNumber,
              1,
              newVal.modified.endLineNumber,
              1,
            ),
            options: {
              isWholeLine: true,
              className: "myHighlightClass",
              firstLineDecorationClassName: "myFirstLineDecorationClassName",
              glyphMarginClassName: "myGlyphMarginClass",
            },
          },
        ]);
        // set original editor highlight range
        const originalEditor = editor.getOriginalEditor();
        originalEditor.createDecorationsCollection([
          {
            range: new monaco.Range(
              newVal.original.startLineNumber,
              1,
              newVal.original.endLineNumber,
              1,
            ),
            options: {
              isWholeLine: true,
              className: "myHighlightClass",
              firstLineDecorationClassName: "myFirstLineDecorationClassName",
              glyphMarginClassName: "myGlyphMarginClass",
            },
          },
        ]);
      }, 100);
    }
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>
<style lang="scss" scoped>
.diff-editor-style {
  margin-top: 5px;
  min-height: 240px;
  height: v-bind(containerHeight);
}
</style>

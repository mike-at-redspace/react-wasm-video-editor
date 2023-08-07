import { useEffect, useRef } from "react";
import CreativeEditorSDK, { UserInterfaceElements } from "@cesdk/cesdk-js";
import {
  caseAssetPath,
  createApplyFormatAsset,
  createDefaultApplyAssetScene,
  unsplashAssetLibrary,
  loadAssetSourceFromContentJSON,
  formatAssetsToPresets,
  pageFormatI18n,
  PAGE_FORMATS_INSERT_ENTRY,
} from "../util";
import PAGE_FORMAT_ASSETS from "../constants/PageFormatAssets.json";
import AUDIO_ASSETS from "../constants/StaticAudioAssets.json";
import VIDEO_SCENES_ASSETS from "../constants/StaticVideoScenesAssets.json";

export const useVideoEditor = () => {
  const cesdk_container = useRef(null);
  const cesdkRef = useRef(null);

  useEffect(() => {
    const config = {
      theme: "dark",
      license: import.meta.env.VITE_CE_LICENSE,
      i18n: {
        en: {
          "libraries.ly.img.audio.ly.img.audio.label": "Soundstripe",
          ...pageFormatI18n(PAGE_FORMAT_ASSETS.assets),
          "libraries.ly.img.video.templates.label": "Example Templates",
          "libraries.unsplash.label": "Unsplash",
        },
      },
      ui: {
        elements: {
          view: "default",
          panels: {
            settings: true,
          },
          presets: {
            pageFormats: formatAssetsToPresets(PAGE_FORMAT_ASSETS),
          },
          dock: {
            groups: [
              {
                id: "misc",
                entryIds: ["pageFormats"],
              },
              {
                id: "examples",
                entryIds: ["ly.img.video.templates"],
              },
              {
                id: "ly.img.defaultGroup",
                showOverview: true,
              },
            ],
          },
          libraries: {
            insert: {
              entries: (defaultEntries) => {
                const entriesWithoutDefaultImages = defaultEntries.filter(
                  (entry) => {
                    return entry.id !== "ly.img.image";
                  }
                );
                return [
                  ...entriesWithoutDefaultImages,
                  PAGE_FORMATS_INSERT_ENTRY,
                  {
                    id: "ly.img.video.templates",
                    sourceIds: ["ly.img.video.templates"],
                    icon: () => caseAssetPath("/static-video-scenes-icon.svg"),
                  },
                  {
                    id: "unsplash",
                    sourceIds: ["unsplash"],
                    previewLength: 3,
                    gridItemHeight: "auto",
                    gridBackgroundType: "cover",
                    gridColumns: 2,
                  },
                ];
              },
            },
            replace: {
              entries: () => {
                return [
                  {
                    id: "unsplash",
                    sourceIds: ["unsplash"],
                    previewLength: 3,
                    gridItemHeight: "auto",
                    gridBackgroundType: "cover",
                    gridColumns: 2,
                  },
                ];
              },
            },
          },

          navigation: {
            position: UserInterfaceElements.NavigationPosition.Top,
            action: {
              export: true,
            },
          },
        },
      },
      callbacks: {
        onUpload: "local",
        onDownload: "download",
        onExport: "download",
      },
    };

    let cesdk;
    if (cesdk_container.current) {
      CreativeEditorSDK.create(cesdk_container.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({
            sceneMode: "Video",
            // We want to replace the demo audio assets with our own
            excludeAssetSourceIds: ["ly.img.audio"],
          });
          cesdk = instance;
          cesdkRef.current = instance;
          cesdk.engine.editor.setSettingBool("page/title/show", false);
          cesdk.engine.scene.loadFromURL(
            caseAssetPath("/templates/motion.scene")
          );

          loadAssetSourceFromContentJSON(
            cesdk.engine,
            VIDEO_SCENES_ASSETS,
            caseAssetPath("/templates"),
            createDefaultApplyAssetScene(cesdk.engine)
          );

          loadAssetSourceFromContentJSON(
            cesdk.engine,
            AUDIO_ASSETS,
            caseAssetPath("/audio")
          );

          loadAssetSourceFromContentJSON(
            cesdk.engine,
            PAGE_FORMAT_ASSETS,
            caseAssetPath("/page-formats"),
            createApplyFormatAsset(cesdk.engine)
          );

          instance.engine.asset.addSource(unsplashAssetLibrary);

          cesdk = instance;
          cesdkRef.current = instance;

          return () => {
            if (cesdk) {
              cesdk.dispose();
            }
          };
        }
      );
    }
  }, [cesdk_container]);

  return { cesdk_container };
};

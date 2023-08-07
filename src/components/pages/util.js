import * as unsplash from "unsplash-js";
import { DesignBlockType } from "@cesdk/cesdk-js";

const UNSPLASH_API_URL = "https://api.unsplash.com/";

const unsplashApi = unsplash.createApi({
  apiUrl: UNSPLASH_API_URL,
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

export const findUnsplashAssets = async (queryData) => {
  if (!UNSPLASH_API_URL && !window.unsplashWarning) {
    window.unsplashWarning = true;
    alert("Please provide your Unsplash API URL.");
  }

  const response = queryData.query
    ? await unsplashApi.search.getPhotos({
        query: queryData.query,
        page: queryData.page,
        perPage: queryData.perPage,
      })
    : await unsplashApi.photos.list({
        orderBy: "popular",
        page: queryData.page,
        perPage: queryData.perPage,
      });

  if (response.type === "success") {
    const { results, total, total_pages } = response.response;
    const currentPage = queryData.page;
    const nextPage =
      currentPage + 1 <= total_pages ? currentPage + 1 : undefined;

    return {
      assets: results.map(translateToAssetResult),
      total,
      currentPage,
      nextPage,
    };
  } else if (response.type === "error") {
    throw new Error(response.errors[0]);
  } else {
    return Promise.resolve(undefined);
  }
};

function translateToAssetResult(image) {
  const artistName = image?.user?.name;
  const artistUrl = image?.user?.links?.html;

  return {
    id: image.id,
    locale: "en",
    tags: image.tags ? image.tags.map((tag) => tag.title) : undefined,
    meta: {
      blockType: "//ly.img.ubq/image",
      uri: image.urls.full,
      thumbUri: image.urls.thumb,
      width: image.width,
      height: image.height,
    },
    context: {
      sourceId: "unsplash",
    },
    credits: artistName
      ? {
          name: artistName,
          url: artistUrl,
        }
      : undefined,
    utm: {
      source: "CE.SDK Demo",
      medium: "referral",
    },
  };
}

export const unsplashAssetLibrary = {
  id: "unsplash",
  findAssets: findUnsplashAssets,
  credits: {
    name: "Unsplash",
    url: "https://unsplash.com/",
  },
  license: {
    name: "Unsplash license (free)",
    url: "https://unsplash.com/license",
  },
};

export const caseAssetPath = (path, caseId = "video-ui") =>
  `${window.location.protocol}//${window.location.host}/cases/${caseId}${path}`;

export const loadAssetSourceFromContentJSON = async (
  engine,
  content,
  baseURL = "",
  applyAsset
) => {
  const { assets, id: sourceId } = content;
  engine.asset.addLocalSource(sourceId, undefined, applyAsset);
  assets.forEach((asset) => {
    if (asset.meta) {
      Object.entries(asset.meta).forEach(([key, value]) => {
        const stringValue = value.toString();
        if (stringValue.includes("{{base_url}}")) {
          const updated = stringValue.replace("{{base_url}}", baseURL);
          asset.meta[key] = updated;
        }
      });
    }
    engine.asset.addAssetToSource(sourceId, asset);
  });
};

export const createDefaultApplyAssetScene = (engine) => async (asset) => {
  if (!asset.meta || !asset.meta.uri) {
    throw new Error("Asset does not have a URI.");
  }
  const scene = await engine.scene.loadFromURL(asset.meta.uri);
  const somePage = engine.block.findByType(DesignBlockType.Page)[0];
  const width = engine.block.getWidth(somePage);
  const height = engine.block.getHeight(somePage);
  engine.block.setFloat(scene, "scene/pageDimensions/height", height);
  engine.block.setFloat(scene, "scene/pageDimensions/width", width);
  engine.block.setString(scene, "scene/pageFormatId", "Custom");
  return scene;
};

const resizePage = (engine, pageId, size) => {
  const currentPageWidth = engine.block.getWidth(pageId);
  const currentPageHeight = engine.block.getHeight(pageId);

  const scale = Math.min(
    size.width / currentPageWidth,
    size.height / currentPageHeight
  );

  const scaledWidth = currentPageWidth * scale;
  const scaledHeight = currentPageHeight * scale;

  const offsetX = 0.5 * (size.width - scaledWidth);
  const offsetY = 0.5 * (size.height - scaledHeight);

  engine.block.scale(pageId, scale, 0.5, 0.5);
  const children = engine.block.getChildren(pageId);
  children.forEach((child) => {
    const x = engine.block.getPositionX(child);
    const y = engine.block.getPositionY(child);
    engine.block.setPositionX(child, x + offsetX);
    engine.block.setPositionY(child, y + offsetY);
  });

  engine.block.setWidth(pageId, size.width);
  engine.block.setHeight(pageId, size.height);
};

export const createApplyFormatAsset = (engine) => async (asset) => {
  const { meta, id } = asset;
  if (!meta) {
    throw new Error("Asset does not have meta.");
  }
  const height = parseInt(meta.formatHeight, 10);
  const width = parseInt(meta.formatWidth, 10);
  const pageIds = engine.block.findByType(DesignBlockType.Page);
  pageIds.forEach((pageId) =>
    resizePage(engine, pageId, {
      height: height,
      width: width,
    })
  );
  const scene = engine.scene.get();
  engine.block.setString(scene, "scene/pageFormatId", id);
  engine.block.setFloat(scene, "scene/pageDimensions/height", height);
  engine.block.setFloat(scene, "scene/pageDimensions/width", width);
};

export const pageFormatI18n = (formats) => {
  return Object.fromEntries([
    ["libraries.pageFormats.label", "Formats"],
    ...formats.map((format) => [
      `preset.document.${format.id}`,
      format.label?.en,
    ]),
  ]);
};

export const PAGE_FORMATS_INSERT_ENTRY = {
  id: "pageFormats",
  sourceIds: ["pageFormats"],
  previewLength: 3,
  gridColumns: 3,
  gridItemHeight: "auto",
  previewBackgroundType: "contain",
  gridBackgroundType: "cover",
  cardLabel: (assetResult) => {
    if (!assetResult) {
      return "";
    }
    if (typeof assetResult.label === "string") {
      return assetResult.label;
    }
    return assetResult.label?.en;
  },
  cardLabelStyle: () => ({
    height: "24px",
    width: "72px",
    left: "4px",
    right: "4px",
    bottom: "-32px",
    padding: "0",
    background: "transparent",
    overflow: "hidden",
    textOverflow: "unset",
    whiteSpace: "unset",
    fontSize: "10px",
    lineHeight: "12px",
    letterSpacing: "0.02em",
    textAlign: "center",
    pointerEvents: "none",
    pointer: "default",
  }),
  cardStyle: () => ({
    height: "80px",
    width: "80px",
    marginBottom: "40px",
    overflow: "visible",
  }),
  icon: () => caseAssetPath("/page-sizes-large-icon.svg"),
  title: ({ group }) => {
    if (group) {
      return `libraries.pageSizes.${group}.label`;
    }
    return undefined;
  },
};

export const formatAssetsToPresets = (contentJSON) => {
  const formatPresets = Object.entries(contentJSON.assets).map(([, asset]) => {
    const { id } = asset;
    const { width, height, unit } = asset.meta;
    const pageFormat = {
      width,
      height,
      unit,
      meta: { default: !!asset.meta.default },
    };
    return [id, pageFormat];
  });
  return Object.fromEntries(formatPresets);
};

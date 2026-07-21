import type { Source } from "../tpl/output/schema";
import globalSource from "../tpl/global/source";
import projectSource from "../tpl/source";

const source: Record<Source["scope"], Source> = {
  global: globalSource,
  project: projectSource,
};

export default source;

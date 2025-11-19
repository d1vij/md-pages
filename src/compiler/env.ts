export let ENV  = {} as IEnv;

interface IEnv {
    markdown_container_id: string,
    origin: string,
    base_url: string,
    rootPath: string,
    assetsPath: string,
}

export function initEnv(env: IEnv){
    ENV = env;
}
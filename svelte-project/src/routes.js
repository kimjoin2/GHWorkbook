import KoreanHistory from './com/koreanHistory/KoreanHistory.svelte';
import Environment from './com/environment/Environment.svelte'

const routes = {
    '/': KoreanHistory,
    '/koreanHistory': KoreanHistory,
    '/environment' : Environment,
};

export default routes;

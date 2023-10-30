<template>
    <p class="img-wrap">
        <img
            :src="src"
            :alt="alt || caption"
            :style="{'max-width': width ? width + 'px' : undefined}"
        >
        <span v-if="caption">{{ caption || alt }}</span>
    </p>
</template>

<script>
import mediumZoom from 'medium-zoom'

export default {
    name: 'VImg',
    props: ['src', 'alt', 'caption', 'width'],
    mounted() {
        mediumZoom(this.$el.querySelector('img'), {
            margin: 24,
            background: 'var(--vp-backdrop-bg-color)',
        })
    },
}
</script>

<style>
.img-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 24px 0;
}

.img-wrap span {
    margin-top: 4px;
    font-size: 14px;
    color: #666;
}
</style>

<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark justify-content-between">
        <div class="app-header">
            <div>
                <a class="navbar-brand" href="#">
                    <span id="logo" class="align-middle">Weathery</span>
                </a>
            </div>
            <div class="search">
                <form class="form-inline my-2 ml-auto" @submit.prevent="submitSearch">
                    <input 
                        :class="searchBar" 
                        type="text" 
                        placeholder="Search for cities..."
                        v-model="search">
                </form>
            </div>          
        </div>
    </nav>
</template>

<script>
    import { searchBus } from '../../src/main.js'

    export default {
        data() {
            return {
                search: '',
            }
        },
        computed: {
            searchBar() {
                if(window.screen.width < 414) {
                    return "form-control-sm";
                } else {
                    return "form-control";
                }
            }
        },
        methods: {
            submitSearch() {
                // Send the search request for Weather.vue component.
                searchBus.$emit('searchSubmitted', this.search);
                this.search = '';
            }
        }
    }
</script>

<style>
    .navbar {
        background-image: linear-gradient(to right, #04519b, #033C73 60%, #02325f);
        padding: 2px 6px;
    }
    .form-control-sm {
        border: 0;
    }
    .app-header {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow: hidden;
        justify-content: space-between;
        width: 100%;
    }
    @media only screen and (min-width: 360px) {
        .navbar {
            padding: 4px 8px;
        }
    }
    @media only screen and (min-width: 411px) {
        .navbar-brand {
            font-size: 1.4em;
        }
        .navbar {
            padding: 10px;
        }
    }
    @media only screen and (min-width: 768px) {
        .navbar-brand {
            font-size: 1.8em;
        }
        .form-inline .form-control {
            height: 50px;
        }
        .navbar {
            padding: 10px 20px;
        }
    }
    @media only screen and (min-width: 900px) {
        .navbar-brand {
            font-size: 2.2em;
        }
        .navbar {
            padding: 20px;
        }
    }
    @media only screen and (min-width: 1025px) {
        .app-header {
            max-width: 1280px;
            margin-left: auto;
            margin-right: auto;
        }
        .navbar {
            padding: 6px 20px;
        }
        .navbar-brand {
            font-size: 1.8rem;
        }
    }
</style>

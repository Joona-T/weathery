<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
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
        padding-top: 2px;
        padding-bottom: 2px;
        background-image: linear-gradient(to right, #04519b, #033C73 60%, #02325f);
    }
    .form-control-sm {
        border: 0;
    }
    .app-header {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-around;
    }
    @media only screen and (min-width: 360px) {
        .app-header {
            justify-content: space-between;
        }
        .search {
            margin-left: 2em;
        }
    }
    @media only screen and (min-width: 375px) {
        .navbar {
            padding-top: 6px;
            padding-bottom: 6px;
        }
        .search {
            padding-right: 0;
            right: 0;
            float: right;
            margin-left: 3em;
        }
    }
    @media only screen and (min-width: 411px) {
        .navbar-brand {
            font-size: 1.4em;
        }
        .navbar {
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .search {
            padding-right: 0;
            right: 0;
            float: right;
            margin-left: 4em;
        }
        .app-header {
            justify-content: space-between;
        }
    }
    @media only screen and (min-width: 768px) {
        .navbar-brand {
            font-size: 1.8em;
        }
        .navbar {
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .search {
            padding-right: 0;
            right: 0;
            float: right;
            margin-left: 4em;
        }
        .app-header {
            justify-content: space-between;
            width: 100%;
        }
        .form-inline .form-control {
            width: 300px;
            height: 50px;
        }
    }
    @media only screen and (min-width: 900px) {
        .navbar-brand {
            font-size: 2.2em;
            padding-left: 20px;
        }
        .navbar {
            padding-top: 20px;
            padding-bottom: 20px;
        }
        .search {
            padding-right: 20px;
        }
    }
    @media only screen and (min-width: 1025px) {
        .app-header {
            max-width: 1024px;
            margin-left: auto;
            margin-right: auto;
        }
        .navbar {
            padding-top: 6px;
            padding-bottom: 6px;
        }
        .navbar-brand {
            font-size: 1.8rem;
        }
    }
</style>

<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>
        <div id="project-big">
            <br/>
            <br/>
            <h1> {{ selected.title }} </h1>
            <h2> {{ selected.subtitle }} </h2>
            <p> {{ selected.description }} </p>
        </div>
    </div>
</template>


<script>
    export default {
        data(){
            return {
                error: "",
                errorFlag: false,
                selected: {},
            }
        },
        mounted: function () {
            this.getProject(this.$route.params.projectId);
        },
        methods: {
            getProject : function(id) {
                if (id != null) {
                    this.$http.get('http://localhost:4941/api/v2/projects/' + id)
                        .then(function (response) {
                            this.selected = response.data;
                        }, function (error) {
                            this.error = error;
                            this.errorFlag = true;
                        });
                }
            }
        }
    }

</script>
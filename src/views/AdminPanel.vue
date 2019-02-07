<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape bg-gradient-default">
    </div>
    <div class="container pt-lg-md col-lg-12">
      <div class="row justify-content-center">
        <div class="col-lg-12">
					<tabs fill class="flex-column flex-md-row">
					    <card shadow>
					        <tab-pane>
					            <span slot="title">
					                <i class="ni ni-cloud-upload-96"/>
					                Home
					            </span>
					            <p class="description">Raw denim you probably haven't heard of them jean shorts
					                Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
					                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro
					                keffiyeh dreamcatcher synth.</p>
					        </tab-pane>

					        <tab-pane title="Profile">
					            <span slot="title">
					                <i class="ni ni-bell-55 mr-2"/>
					                Profile
					            </span>
					            <p class="description">Cosby sweater eu banh mi, qui irure terry richardson ex
					                squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan
					                american apparel, butcher voluptate nisi qui.</p>
					        </tab-pane>

					        <tab-pane>
					             <span slot="title">
					                <i class="ni ni-calendar-grid-58"/>
					                Messages
					              </span>
					            <p class="description">Raw denim you probably haven't heard of them jean shorts
					                Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
					                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro
					                keffiyeh dreamcatcher synth.</p>
					        </tab-pane>
					    </card>
					</tabs>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
	import Tabs from "@/components/Tabs/Tabs";
	import TabPane from "@/components/Tabs/TabPane";
	export default {
		components: {
			Tabs,
			TabPane
		}
	}
</script>

<style>
	
</style>
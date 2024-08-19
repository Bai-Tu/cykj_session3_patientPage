<template>
    <div v-html="formHtml"></div>
</template>

<script>
export default {
  data() {
    return {
      formHtml: ''
    };
  },
  async created() {
    const queryParams = new URLSearchParams(this.$route.query);
    const totalAmount = queryParams.get('total_amount');
    const patientId = queryParams.get('patientId');
    
    
    try {
      const response = await this.$axios.post('/pay/alipay', { total_amount: totalAmount,body:patientId});
      this.formHtml = response.data.msg;
      this.$nextTick(() => {
        this.submitForm();
      });
    } catch (error) {
      console.error('Error submitting budget:', error);
    }
  },
  methods: {
    submitForm() {
      const formElement = this.$el.querySelector('form');
      if (formElement) {
        formElement.submit();
      } else {
        console.error('Form element not found in the HTML');
      }
    }
  }
};
</script>
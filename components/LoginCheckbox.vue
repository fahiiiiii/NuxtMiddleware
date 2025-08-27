<!-- components/LoginCheckbox.vue -->
<template>
  <v-container fluid>
    <div class="text-subtitle-2 text-medium-emphasis mb-3">Choose your role</div>
    
    <v-checkbox
      :model-value="selectedRoles.admin"
      label="Admin"
      @update:model-value="updateRole('admin', $event)"
    ></v-checkbox>
    
    <v-checkbox
      :model-value="selectedRoles.student"
      label="Student"
      @update:model-value="updateRole('student', $event)"
    ></v-checkbox>
    
    <v-checkbox
      :model-value="selectedRoles.teacher"
      label="Teacher"
      @update:model-value="updateRole('teacher', $event)"
    ></v-checkbox>
    
    <v-checkbox
      :model-value="selectedRoles.securityGuard"
      label="Security Guard"
      @update:model-value="updateRole('securityGuard', $event)"
    ></v-checkbox>
  </v-container>
</template>

<script setup>

// Props
const props = defineProps({
  selectedRoles: {
    type: Object,
    default: () => ({
      admin: false,
      student: true,
      teacher: false,
      securityGuard: false
    })
  }
})

// Emits
const emit = defineEmits(['update:selected-roles'])

// Update role and emit to parent
const updateRole = (roleName, value) => {
  const updatedRoles = {
    ...props.selectedRoles,
    [roleName]: value
  }
  
  // Emit the updated roles to parent component
  emit('update:selected-roles', updatedRoles)
}
</script>


<!-- 1. Role Selection (চেকবক্স নির্বাচন)

প্রথমে দেখুন, LoginCheckbox.vue কম্পোনেন্টে চারটি চেকবক্স রয়েছে, যা বিভিন্ন রোলের জন্য:

Admin

Student

Teacher

Security Guard

এই চেকবক্সগুলোর মাধ্যমে ব্যবহারকারী একটি বা একাধিক রোল নির্বাচন করতে পারেন। প্রতিটি চেকবক্সের সাথে একটি v-model ব্যবহার করা হয়েছে, যেটি চেকবক্সের মান (যেমন: সিলেক্টেড বা সিলেক্ট করা হয়নি) ধরে রাখে।

উদাহরণস্বরূপ:

<v-checkbox
  :model-value="selectedRoles.admin"
  label="Admin"
  @update:model-value="updateRole('admin', $event)"
></v-checkbox>


এখানে, model-value="selectedRoles.admin" মানে হচ্ছে selectedRoles অবজেক্টের admin প্রপার্টির মান এই চেকবক্সের সাথে যুক্ত থাকবে। অর্থাৎ, যদি ব্যবহারকারী "Admin" চেকবক্সটি সিলেক্ট করে, তখন selectedRoles.admin হবে true, আর যদি ডিজিলেক্ট করে, তাহলে এটি false হয়ে যাবে।

@update:model-value="updateRole('admin', $event)" এই অংশটা কী করে?

যখন চেকবক্সে কোনো পরিবর্তন ঘটে (যেমন, সিলেক্ট করা বা ডিজিলেক্ট করা), তখন updateRole ফাংশনটি কল হয়। এই ফাংশনটি নতুন রোল ভ্যালু (যেমন, true বা false) এবং রোলের নাম (যেমন, 'admin', 'student') গ্রহণ করে।

2. Emitting Data (ডেটা প্যারেন্টে পাঠানো)

updateRole ফাংশনটির কাজ হচ্ছে, নতুন নির্বাচিত রোলের ডেটা আপডেট করা এবং এটি প্যারেন্ট কম্পোনেন্টে পাঠানো। এটা কিভাবে হয়?

updateRole ফাংশনটি কীভাবে কাজ করে:
const updateRole = (roleName, value) => {
  const updatedRoles = {
    ...props.selectedRoles,
    [roleName]: value
  }
  
  // Emit the updated roles to parent component
  emit('update:selected-roles', updatedRoles)
}


updatedRoles অবজেক্টে, বর্তমান selectedRoles এর সাথে যে রোলটি পরিবর্তন হয়েছে (যেমন, admin, student ইত্যাদি), সেই রোলের নতুন মান যোগ করা হয়। এখানে roleName হল যেটি চেকবক্সের জন্য ব্যবহার হচ্ছে (যেমন, 'admin' বা 'student'), এবং value হল নতুন মান (যেমন, true বা false), যা চেকবক্সটি সিলেক্ট বা ডিজিলেক্ট হওয়ার কারণে এসেছে।

তারপর emit ব্যবহার করে update:selected-roles ইভেন্টটি প্যারেন্ট কম্পোনেন্টে পাঠানো হয়। এর মানে হলো, প্যারেন্ট কম্পোনেন্টে জানিয়ে দেওয়া হয় যে রোলের মান আপডেট হয়েছে।

উদাহরণস্বরূপ, যদি ব্যবহারকারী "Admin" চেকবক্স সিলেক্ট করে, তাহলে updatedRoles হবে:

{
  admin: true,
  student: false,
  teacher: false,
  securityGuard: false
}


এবং emit('update:selected-roles', updatedRoles) ফাংশনটি প্যারেন্ট কম্পোনেন্টে (যেমন login.vue তে) এই নতুন ডেটা পাঠাবে। প্যারেন্ট কম্পোনেন্ট তারপর এই ডেটা গ্রহণ করবে এবং এর মধ্যে যেকোনো প্রয়োজনীয় পরিবর্তন করবে।

3. login.vue-এ Role Selection Handling

login.vue পেজে, LoginCheckbox কম্পোনেন্টে এই selected-roles ডেটা পাঠানো হচ্ছে:

<LoginCheckbox 
  :selected-roles="formData.roles"
  @update:selected-roles="handleRoleUpdate"
/>


selected-roles="formData.roles": এখানে formData.roles পাস করা হচ্ছে, যা একটি অবজেক্ট, এবং এটি রোলগুলোর মান ধারণ করে।

@update:selected-roles="handleRoleUpdate": এখানে @update:selected-roles ইভেন্টটি handleRoleUpdate ফাংশন দ্বারা হ্যান্ডল করা হচ্ছে। মানে, যখন LoginCheckbox কম্পোনেন্টে রোলের মান পরিবর্তন হয়, তখন handleRoleUpdate ফাংশনটি কল হবে এবং প্যারেন্ট কম্পোনেন্টে সেই নতুন রোল ডেটা আপডেট হবে।

const handleRoleUpdate = (updatedRoles) => {
  formData.roles = updatedRoles
}


এভাবে, প্যারেন্ট কম্পোনেন্টে রোলের মান পরিবর্তিত হয় এবং formData.roles আপডেট হয়ে যায়। 




LoginCheckbox.vue — এটি একটি কম্পোনেন্ট যা ব্যবহারকারীর ভূমিকা (role) নির্বাচন করতে সাহায্য করে।

login.vue — এটি একটি পেজ যা লগইন ফর্মের জন্য ব্যবহৃত হয়, যেখানে ব্যবহারকারী ইমেইল, পাসওয়ার্ড এবং ভূমিকা নির্বাচন করে লগইন করতে পারে।

LoginCheckbox.vue

এই কম্পোনেন্টটি একটি সিম্পল চেকবক্স গ্রুপ তৈরি করে যেখানে ব্যবহারকারী বিভিন্ন ভূমিকা নির্বাচন করতে পারে:

Admin

Student

Teacher

Security Guard

মূল পয়েন্ট:

selectedRoles prop: এই কম্পোনেন্টটি selectedRoles নামে একটি prop নেয়, যা একটি অবজেক্ট। এটি শুরুতে কিছু ডিফল্ট ভ্যালু সহ আসে (যেমন: student: true এবং অন্যান্যগুলো false)।

Checkboxes: এখানে চারটি v-checkbox এলিমেন্ট রয়েছে, প্রতিটি একটি নির্দিষ্ট ভূমিকার জন্য। যেমন, Admin, Student, Teacher, Security Guard।

Role selection: যখন ব্যবহারকারী একটি চেকবক্স নির্বাচন বা ডিজিলেক্ট করে, তখন updateRole ফাংশনটি কল হয়, যা selectedRoles আপডেট করে এবং সেটি @update:selected-roles ইভেন্টের মাধ্যমে প্যারেন্ট কম্পোনেন্টে পাঠায়।

Emitting data: updateRole ফাংশনে emit ব্যবহৃত হচ্ছে, যার মাধ্যমে প্যারেন্ট কম্পোনেন্টকে অবগত করা হয় যে কোন রোল নির্বাচিত হয়েছে।-->